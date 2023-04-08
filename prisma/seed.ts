import { db } from "@/lib/db";

const getRandomAppType = () => {
    const types = [
        "web", "mobile", "game", "social"
    ];
    return types[Math.floor(Math.random() * types.length)];
};

const names = [
    "Sophia", "Ethan", "Isabella", "Benjamin",
    "Emma", "Alexander", "Mia", "William", "Ava",
    "Michael", "Olivia", "Daniel", "Grace", "James",
    "Lily", "Samuel", "Harper", "Elijah", "Charlotte", 
    "Matthew", "Amelia", "David", "Scarlett", "Joseph",
    "Madison", "Jacob", "Abigail", "Andrew", "Emily",
    "Nicholas"
]

async function main() {
    const developers = await Promise.all(
        names.map((name) => 
            db.developer.upsert({
                // upsert looks for where field and applies updates
                // if field not found, creates new
                where: { email: `${name}@email.com` },
                update: {},
                create: {
                    email: `${name}@email.com`,
                    name: name,
                    linkedin: "https://www.linkedin.com/",
                    app: {
                        create: {
                            appName: `${name}'s app name`,
                            description: "An app that does something cool",
                            developers: [name],
                            appLink: "https://google.com/",
                            videoLink: "https://youtube.com/",
                            github: "https://github.com/",
                            type: getRandomAppType(),
                            technologies: ["React", "Python", "AWS"]
                        }
                    }
                }
        }))
    )
    console.log({ developers });
}
main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });
