import { PhraseShare, PhraseType, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { kebabCase, startCase } from "lodash";
import { slugify } from "~/utils/slugify";
import { faker } from "@faker-js/faker";
import diacritics from "diacritics";

const prisma = new PrismaClient();

async function seed() {
  // cleanup the existing database
  await prisma.user.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.phrase.deleteMany({});

  const johnEmail = "john@example.com";
  const janeEmail = "jane@example.com";
  const emptyEmail = "empty@example.com";
  const hashedPassword = await bcrypt.hash("password123", 10);

  const john = await prisma.user.create({
    data: {
      email: johnEmail,
      username: "John",
      usernameLower: "john",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const jane = await prisma.user.create({
    data: {
      email: janeEmail,
      username: "Jane",
      usernameLower: "jane",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.user.create({
    // empty user that does not have any phrases
    data: {
      email: emptyEmail,
      username: "Empty",
      usernameLower: "empty",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.phrase.create({
    data: {
      id: "phrase-1",
      slug: kebabCase("Gall's Law"),
      type: PhraseType.QUOTATION,
      language: "english",
      share: PhraseShare.PUBLIC,
      title: "Gall's Law",
      text: "A complex system that works is invariably found to have evolved from a simple system that worked. The inverse proposition also appears to be true: A complex system designed from scratch never works and cannot be made to work. You have to start over, beginning with a working simple system.",
      description:
        "Gall's Law is a rule of thumb for systems design from Gall's book Systemantics: How Systems Really Work and How They Fail. This law is essentially an argument in favour of underspecification: it can be used to explain the success of systems like the World Wide Web and Blogosphere, which grew from simple to complex systems incrementally, and the failure of systems like CORBA, which began with complex specifications. Gall's Law has strong affinities to the practice of agile software development.",
      attribution: "John Gall",
      source: "https://en.wikipedia.org/wiki/John_Gall_(author)#Gall's_law",
      userId: john.id,
      tags: {
        create: [
          { name: "Software", nameNormalized: "software", language: "english" },
          { name: "Law", nameNormalized: "Law", language: "english" },
        ],
      },
    },
  });

  await prisma.phrase.create({
    data: {
      id: "phrase-2",
      type: PhraseType.OTHER,
      slug: kebabCase("Screw motivation, what you need is discipline."),
      language: "english",
      share: PhraseShare.RESTRICTED,
      title: "PRIVATE PHRASE",
      text: "Screw motivation, what you need is discipline.",
      source:
        "https://www.wisdomination.com/screw-motivation-what-you-need-is-discipline/",
      userId: john.id,
      tags: {
        create: [
          {
            name: "Motivation",
            nameNormalized: "motivation",
            language: "english",
          },
          {
            name: "Discipline",
            nameNormalized: "discipline",
            language: "english",
          },
        ],
      },
    },
  });

  await prisma.phrase.create({
    data: {
      id: "phrase-3",
      type: PhraseType.PROVERB,
      slug: kebabCase("Birds of a feather flock together."),
      language: "english",
      share: PhraseShare.RESTRICTED,
      title: "PUBLIC-OWNER PHRASE",
      text: "Birds of a feather flock together.",
      description:
        "People of the same sort or with the same tastes and interests will be found together.",
      userId: john.id,
      tags: {
        create: [
          {
            name: "Interests",
            nameNormalized: "interests",
            language: "english",
          },
        ],
      },
    },
  });

  const softwareTag = await prisma.tag.findFirst({
    where: { name: "Software", language: "english" },
  });

  await prisma.phrase.create({
    data: {
      id: "phrase-4",
      type: PhraseType.QUOTATION,
      slug: slugify("Conway's Law"),
      language: "english",
      share: PhraseShare.PUBLIC,
      title: "Conway's Law",
      text: "Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization's communication structure.",
      description:
        "Conway's law is an adage that states organizations design systems that mirror their own communication structure. It is named after the computer programmer Melvin Conway, who introduced the idea in 1967.",
      attribution: "Melvin Conway",
      userId: john.id,
      tags: {
        create: [
          {
            name: "Organization",
            nameNormalized: "organization",
            language: "english",
          },
        ],
        connect: [{ id: softwareTag?.id }],
      },
    },
  });

  await prisma.phrase.create({
    data: {
      id: "phrase-5",
      type: PhraseType.OTHER,
      slug: slugify(
        "We laten de kwaliteit van de dag afhangen van hoe goed we hebben geslapen, i.p.v. dat de kwaliteit van de dag bepaalt hoe we slapen."
      ),
      language: "dutch",
      share: PhraseShare.PUBLIC,
      text: "We laten de kwaliteit van de dag afhangen van hoe goed we hebben geslapen, i.p.v. dat de kwaliteit van de dag bepaalt hoe we slapen.",
      userId: john.id,
      tags: {
        create: [
          { name: "Slaap", nameNormalized: "slaap", language: "dutch" },
          { name: "Geluk", nameNormalized: "geluk", language: "dutch" },
        ],
      },
    },
  });

  await prisma.phrase.create({
    data: {
      id: "phrase-6",
      type: PhraseType.QUOTATION,
      slug: slugify(
        "Spread love everywhere you go. Let no one ever come to you without leaving happier."
      ),
      language: "english",
      share: PhraseShare.PUBLIC,
      text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
      attribution: "Mother Teresa",
      userId: jane.id,
      tags: {
        create: [{ name: "Love", nameNormalized: "love", language: "english" }],
      },
    },
  });

  await prisma.phrase.create({
    data: {
      id: "phrase-7",
      type: PhraseType.QUOTATION,
      slug: slugify("Life is a long lesson in humility"),
      language: "english",
      share: PhraseShare.PUBLIC,
      text: "Life is a long lesson in humility",
      attribution: "James M. Barrie",
      userId: jane.id,
      tags: {
        create: [
          { name: "Life", nameNormalized: "life", language: "english" },
          { name: "Humility", nameNormalized: "humility", language: "english" },
        ],
      },
    },
  });

  await prisma.phrase.create({
    data: {
      id: "phrase-8",
      type: PhraseType.OTHER,
      slug: slugify("Markdown"),
      language: "english",
      share: PhraseShare.PUBLIC,
      title: "Markdown",
      text: "This phrase has a markdown description",
      description: `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |`,
      userId: jane.id,
      tags: {
        create: [
          { name: "Markdown", nameNormalized: "markdown", language: "english" },
        ],
      },
    },
  });

  // Generate a bunch of auto generated phrases with a create date in the past.
  for (let i = 0; i < 1000; i++) {
    // Create tag(s) if needed
    const connect = [];
    const numTags = faker.datatype.number(3);
    for (let i = 0; i < numTags; i++) {
      const name = faker.hacker.noun();
      let tag = await prisma.tag.findFirst({
        where: { name: startCase(name), language: "english" },
      });
      if (!tag) {
        await prisma.tag.create({
          data: {
            name: startCase(name),
            nameNormalized: diacritics.remove(name).toLowerCase(),
            language: "english",
          },
        });
      }
      tag = await prisma.tag.findFirst({
        where: { name: startCase(name), language: "english" },
      });
      if (tag === null) {
        throw new Error("Failed to create tag");
      }
      connect.push({ id: tag.id });
    }

    await prisma.phrase.create({
      data: {
        id: `faker-${i + 1}`,
        type: faker.helpers.arrayElement(
          Object.values(PhraseType)
        ) as PhraseType,
        slug: slugify("Markdown"),
        language: "english",
        share: PhraseShare.PUBLIC,
        title:
          faker.datatype.number(1) > 0 // 50% chance of separate title
            ? startCase(
                `${faker.hacker.noun()} ${faker.hacker.adjective()} ${faker.hacker.verb()}`
              )
            : null,
        text: faker.hacker.phrase(),
        description: faker.lorem.paragraph(),
        userId: faker.helpers.arrayElement([john.id, jane.id]),
        createdAt: faker.date.between(
          "2020-01-01T00:00:00.000Z",
          "2023-01-01T00:00:00.000Z"
        ),
        tags: {
          connect,
        },
      },
    });
  }

  // Generate a bunch of tags
  const tags = new Set<string>();
  while (tags.size < 10000) {
    tags.add(faker.random.word());
  }
  for (const name of tags) {
    const nameNormalized = diacritics.remove(name).toLowerCase();
    await prisma.tag.upsert({
      where: {
        nameNormalized_language: { nameNormalized, language: "english" },
      },
      update: {},
      create: {
        name: startCase(name),
        nameNormalized,
        language: "english",
      },
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
