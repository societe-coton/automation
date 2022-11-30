export default () => ({
  notion: {
    token: process.env.NOTION_KEY,
    databaseID: process.env.NOTION_DATABASE_ID,
  },
  sendinblue: {
    token: process.env.SENDINBLUE_KEY,
  },
});
