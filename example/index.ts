import { Gorse } from "../src";

const client = new Gorse({
  endpoint: "http://127.0.0.1:8087",
  secret: "gorse"
});

async function seed() {
  // Seed some Users
  await client.insertUser({
    UserId: "100",
    Labels: ["user", "registered"],
    Comment: "User 100"
  });
  await client.insertUser({
    UserId: "101",
    Labels: ["user", "registered"],
    Comment: "User 101"
  });
  await client.insertUser({
    UserId: "102",
    Labels: ["user", "registered"],
    Comment: "User 102"
  });
  await client.insertUser({
    UserId: "110",
    Labels: ["user", "registered", "admin"],
    Comment: "User 110"
  });
  await client.insertUser({
    UserId: "105",
    Labels: ["user", "registered", "teacher"],
    Comment: "User 105"
  });
  await client.insertUser({
    UserId: "106",
    Labels: ["user", "registered", "teacher"],
    Comment: "User 106"
  });

  // Seed some Items
  await client.upsertItem({
    ItemId: "500",
    IsHidden: true,
    Comment: "Oppenheimer",
    Timestamp: new Date("2023-07-21T00:00:00Z"),
    Categories: ["biography", "drama", "history"],
    Labels: ["Christopher Nolan", "Cillian Murphy", "Robert Downey Jr."]
  });

  await client.upsertItem({
    ItemId: "501",
    IsHidden: false,
    Comment: "The Shawshank Redemption",
    Timestamp: new Date("1994-09-10T00:00:00Z"),
    Categories: ["drama"],
    Labels: ["Frank Darabont", "Tim Robbins", "Morgan Freeman"]
  });

  await client.upsertItem({
    ItemId: "502",
    IsHidden: false,
    Comment: "The Godfather",
    Timestamp: new Date("1972-03-14T00:00:00Z"),
    Categories: ["noir", "gangster", "drama"],
    Labels: ["Francis Ford Coppola", "Marlon Brando", "Al Pacino"]
  });

  await client.upsertItem({
    ItemId: "503",
    IsHidden: false,
    Comment: "The Dark Knight",
    Timestamp: new Date("2008-07-14T00:00:00Z"),
    Categories: ["action", "noir", "thriller", "drama", "adventure"],
    Labels: ["Christopher Nolan", "Christian Bale", "Michael Caine"]
  });

  await client.upsertItem({
    ItemId: "505",
    IsHidden: false,
    Comment: "The Godfather: Part II",
    Timestamp: new Date("1974-12-12T00:00:00Z"),
    Categories: ["noir", "gangster", "drama"],
    Labels: ["Francis Ford Coppola", "Robert Duvall", "Al Pacino"]
  });

  await client.upsertItem({
    ItemId: "506",
    IsHidden: false,
    Comment: "Inception",
    Timestamp: new Date("2010-07-16T00:00:00Z"),
    Categories: ["noir", "gangster", "drama"],
    Labels: ["Christopher Nolan", "Leonardo DiCaprio", "Joseph Gordon-Levitt"]
  });

  await client.upsertItem({
    ItemId: "507",
    IsHidden: false,
    Comment: "Interstellar",
    Timestamp: new Date("2014-10-26T00:00:00Z"),
    Categories: ["science fiction", "adventure", "drama"],
    Labels: ["Christopher Nolan", "Matthew McConaughey", "Anne Hathaway"]
  });

  await client.upsertItem({
    ItemId: "508",
    IsHidden: false,
    Comment: "Tenet",
    Timestamp: new Date("2020-08-26T00:00:00Z"),
    Categories: ["action", "thriller", "spy", "science fiction"],
    Labels: ["Christopher Nolan", "John David Washington", "Robert Pattinson"]
  });

  // Seed some Feedback

  // Read feedbacks
  await client.insertFeedbacks([
    // User 101
    {
      FeedbackType: "read",
      ItemId: "500",
      UserId: "101",
      Timestamp: new Date()
    },
    {
      FeedbackType: "read",
      ItemId: "508",
      UserId: "101",
      Timestamp: new Date()
    },
    {
      FeedbackType: "read",
      ItemId: "507",
      UserId: "101",
      Timestamp: new Date()
    },
    {
      FeedbackType: "read",
      ItemId: "503",
      UserId: "101",
      Timestamp: new Date()
    },
    // User 102
    {
      FeedbackType: "read",
      ItemId: "500",
      UserId: "102",
      Timestamp: new Date()
    },
    {
      FeedbackType: "read",
      ItemId: "502",
      UserId: "102",
      Timestamp: new Date()
    }
  ]);

  // Buy
  await client.insertFeedbacks([
    {
      FeedbackType: "buy",
      ItemId: "507",
      UserId: "101",
      Timestamp: new Date()
    },
    {
      FeedbackType: "buy",
      ItemId: "503",
      UserId: "101",
      Timestamp: new Date()
    },
    // User 102
    {
      FeedbackType: "buy",
      ItemId: "502",
      UserId: "102",
      Timestamp: new Date()
    }
  ]);
}

seed().then(() => {
  console.log("Seed Done!");
  console.log("Recommend for user 101:");
  return client.getRecommend({
    userId: "101"
  });
}).then((recommendedItems) => {
  recommendedItems.forEach((element) => console.log(element));
});

