import {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { BlockType } from "src/types/notion.type";

export const formatNotionBlockContentToHtml = (content: BlockObjectResponse[]): string => {
  const text = content.map((con: BlockObjectResponse): string => {
    const typeName: string = con.type;
    const blockType: BlockType = con[typeName] as BlockType;
    const richText: RichTextItemResponse[] = blockType.rich_text;

    return formatNotionRichTextToHtmlTag(richText, typeName);
  });

  const formattedContent = text.join("");

  return `<html>${formattedContent}</html>`;
};

const formatNotionRichTextToHtmlTag = (text: RichTextItemResponse[], type: string): string => {
  const formattedText = text.map((t: RichTextItemResponse): string => {
    const text = t.plain_text;

    const annotations = t.annotations;
    const color = annotations.color;

    let textWithTags: string;

    // First switch statement adds inline tags
    switch (true) {
      case annotations.bold:
        textWithTags = addTags(text, "b", color);
        break;
      case annotations.italic:
        textWithTags = addTags(text, "i", color);
        break;
      case annotations.strikethrough:
        textWithTags = addTags(text, "s", color);
        break;
      case annotations.underline:
        textWithTags = addTags(text, "u", color);
        break;
      case type === "toggle":
        textWithTags = addTags(text, "a", color, t.href);
        break;
      default:
        textWithTags = addTags(text, "span", color);
        break;
    }

    return textWithTags;
  });
  const joinedText = formattedText.join("");

  let textWithTags: string;

  // Second switch statement adds block tags
  switch (type) {
    case "bulleted_list_item":
      textWithTags = addTags(joinedText, "li");
      break;
    case "quote":
      textWithTags = addTags(joinedText, "i");
      textWithTags = addTags(textWithTags, "p");
      break;
    default:
      textWithTags = addTags(joinedText, "p");
      break;
  }

  return textWithTags;
};

const addTags = (text: string, tag: string, color?: string, href?: string): string => {
  const inlineColor = color ? `style= "color: ${color}"` : "";
  const inlineHref = href ? `href= "${href}"` : "";

  return `<${tag} ${inlineColor} ${inlineHref}>${text}</${tag}>`;
};
