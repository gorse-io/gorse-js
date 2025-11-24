import { Gorse, GorseException } from "../src";

const client = new Gorse({
  endpoint: "http://127.0.0.1:8088",
  secret: "gorse",
});

test("connection error", async () => {
  const client = new Gorse({
    endpoint: "",
    debug: true,
  });

  await expect(client.getLatest({})).rejects.toThrow(GorseException);
});

test("test users", async () => {
  const resp = await client.getUsers({ n: 3 });
  expect(resp.Cursor).not.toBe("");
  expect(resp.Users).toEqual([
    {
      UserId: "1",
      Labels: {
        age: 24,
        gender: "M",
        occupation: "technician",
        zip_code: "85711",
      },
      Comment: "",
    },
    {
      UserId: "10",
      Labels: {
        age: 53,
        gender: "M",
        occupation: "lawyer",
        zip_code: "90703",
      },
      Comment: "",
    },
    {
      UserId: "100",
      Labels: {
        age: 36,
        gender: "M",
        occupation: "executive",
        zip_code: "90254",
      },
      Comment: "",
    },
  ]);

  const user = {
    UserId: "1000",
    Labels: {
      gender: "M",
      occupation: "engineer",
    },
    Comment: "zhenghaoz",
  };
  let rowAffected = await client.insertUser(user);
  expect(rowAffected).toBe(1);
  const respUser = await client.getUser("1000");
  expect(respUser).toEqual(user);

  rowAffected = await client.deleteUser("1000");
  expect(rowAffected).toBe(1);
  await expect(client.getUser("1000")).rejects.toThrow(GorseException);
});

test("test items", async () => {
  const resp = await client.getItems({ n: 3 });
  expect(resp.Cursor).not.toBe("");
  expect(resp.Items[0].ItemId).toBe("1");
  expect(resp.Items[0].Categories).toEqual([
    "Animation",
    "Children's",
    "Comedy",
  ]);
  expect(new Date(resp.Items[0].Timestamp).toISOString()).toBe(
    "1995-01-01T00:00:00.000Z",
  );
  expect(resp.Items[0].Comment).toBe("Toy Story (1995)");
  expect(resp.Items[1].ItemId).toBe("10");
  expect(resp.Items[1].Categories).toEqual(["Drama", "War"]);
  expect(new Date(resp.Items[1].Timestamp).toISOString()).toBe(
    "1996-01-22T00:00:00.000Z",
  );
  expect(resp.Items[1].Comment).toBe("Richard III (1995)");
  expect(resp.Items[2].ItemId).toBe("100");
  expect(resp.Items[2].Categories).toEqual(["Crime", "Drama", "Thriller"]);
  expect(new Date(resp.Items[2].Timestamp).toISOString()).toBe(
    "1997-02-14T00:00:00.000Z",
  );
  expect(resp.Items[2].Comment).toBe("Fargo (1996)");

  const item = {
    ItemId: "2000",
    IsHidden: true,
    Labels: {
      embedding: [0.1, 0.2, 0.3],
    },
    Categories: ["Comedy", "Animation"],
    Timestamp: "2023-01-01T00:00:00Z",
    Comment: "Minions (2015)",
  };
  let rowAffected = await client.upsertItem(item);
  expect(rowAffected).toBe(1);
  let respItem = await client.getItem("2000");
  expect(respItem).toEqual(item);

  rowAffected = await client.updateItem("2000", { Comment: "小黄人 (2015)" });
  expect(rowAffected).toBe(1);
  respItem = await client.getItem("2000");
  expect(respItem.Comment).toBe("小黄人 (2015)");

  rowAffected = await client.deleteItem("2000");
  expect(rowAffected).toBe(1);
  await expect(client.getItem("2000")).rejects.toThrow(GorseException);
});

test("test feedback", async () => {
  client.insertUser({ UserId: "2000" });

  const feedbacks = [
    {
      FeedbackType: "watch",
      UserId: "2000",
      ItemId: "1",
      Value: 1,
      Timestamp: "2023-06-01T00:00:00Z",
      Comment: "",
    },
    {
      FeedbackType: "watch",
      UserId: "2000",
      ItemId: "1060",
      Value: 2,
      Timestamp: "2023-06-02T00:00:00Z",
      Comment: "",
    },
    {
      FeedbackType: "watch",
      UserId: "2000",
      ItemId: "11",
      Value: 3,
      Timestamp: "2023-06-03T00:00:00Z",
      Comment: "",
    },
  ];
  for (const fb of feedbacks) {
    await client.deleteFeedback({
      type: "watch",
      userId: fb.UserId,
      itemId: fb.ItemId,
    });
  }
  let rowAffected = await client.insertFeedbacks(feedbacks);
  expect(rowAffected).toBe(3);

  let userFeedback = await client.getUserFeedbackByType("2000", "watch");
  expect(userFeedback).toEqual(feedbacks);

  rowAffected = await client.deleteFeedback({
    type: "watch",
    userId: "2000",
    itemId: "1",
  });
  expect(rowAffected).toBe(1);
  userFeedback = await client.getUserFeedbackByType("2000", "watch");
  expect(userFeedback).toEqual([feedbacks[1], feedbacks[2]]);
});

test("test item to item", async () => {
  const neighbors = await client.getItemNeighbors({
    itemId: "1",
    cursorOptions: { n: 3 },
  });
  console.log(neighbors);
  expect(neighbors).toHaveLength(3);
  expect(neighbors[0].Id).toBe("1060");
  expect(neighbors[1].Id).toBe("404");
  expect(neighbors[2].Id).toBe("1219");
});

test("test recommend", async () => {
  client.insertUser({ UserId: "3000" });
  const recommendations = await client.getRecommend({
    userId: "3000",
    cursorOptions: { n: 3 },
  });
  expect(recommendations).toHaveLength(3);
  expect(recommendations[0]).toBe("315");
  expect(recommendations[1]).toBe("1432");
  expect(recommendations[2]).toBe("918");
});
