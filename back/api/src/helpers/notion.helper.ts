import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { BlockType } from "src/types/notion.type";

export const formatContent = (content: BlockObjectResponse[]): string => {
  const text = content.map((con) => {
    const type = con.type;
    const blockType = con[type] as BlockType;
    const richText = blockType.rich_text[0];
    if (!richText) return "<br/>";
    if (type === "toggle") return `<a href=${richText.href}>${richText.plain_text}</a>`;

    return blockType.rich_text[0].plain_text;
  });

  const formattedContent = text.join("<br />");

  return formattedContent;
};
