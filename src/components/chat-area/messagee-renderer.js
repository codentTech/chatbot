import React from "react";

// Simple markdown parser for common formatting
function parseMarkdown(text) {
  if (!text) return "";

  // Split text into lines for better processing
  let lines = text.split("\n");
  let parsed = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      parsed.push("<br>");
      continue;
    }

    // Handle numbered headings like **1. Thumb-Friendly Design**
    if (/^\*\*\d+\.\s+.*\*\*$/.test(line.trim())) {
      let content = line.replace(/^\*\*/, "").replace(/\*\*$/, "");
      parsed.push(`<h4>${content}</h4>`);
      continue;
    }

    // Handle headers
    if (line.startsWith("### ")) {
      parsed.push(`<h3>${line.substring(4)}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      parsed.push(`<h2>${line.substring(3)}</h2>`);
      continue;
    }
    if (line.startsWith("# ")) {
      parsed.push(`<h1>${line.substring(2)}</h1>`);
      continue;
    }

    // Handle bullet points
    if (line.startsWith("• ") || line.startsWith("- ")) {
      let content = line.substring(2);
      // Apply bold formatting to the bullet content
      content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      parsed.push(`<li>${content}</li>`);
      continue;
    }

    // Handle regular text with formatting
    line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Bold
    line = line.replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italic
    line = line.replace(/`(.*?)`/g, "<code>$1</code>"); // Inline code
    line = line.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    ); // Links

    parsed.push(`<p>${line}</p>`);
  }

  // Join and wrap consecutive list items in ul tags
  let result = parsed.join("");
  result = result.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/g, (match) => {
    return "<ul>" + match + "</ul>";
  });

  // Clean up extra br tags
  result = result.replace(/<br><\/ul>/g, "</ul>");
  result = result.replace(/<ul><br>/g, "<ul>");
  result = result.replace(/<br><h4>/g, "<h4>");
  result = result.replace(/<\/h4><br>/g, "</h4>");

  return result;
}

// Message renderer component
function MessageRenderer({ content }) {
  const parsedContent = parseMarkdown(content);

  const messageStyles = {
    h1: "text-2xl font-bold mb-4 text-white",
    h2: "text-xl font-bold mb-3 text-white",
    h3: "text-lg font-bold mb-2 text-white",
    h4: "text-lg font-bold mb-3 mt-4 text-white", // For numbered list titles like **1. Title**
    strong: "font-semibold text-white",
    em: "italic text-white",
    code: "px-2 py-1 rounded text-sm font-mono text-white",
    pre: "my-4 p-4 rounded-lg overflow-x-auto text-white",
    ul: "my-3 space-y-1 pl-6", // Bullet lists with left padding
    li: "text-white relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold", // Custom bullets with single quotes
    p: "mb-3 last:mb-0 text-white",
    a: "text-white hover:text-gray-200 underline underline-offset-2",
  };

  return (
    <div
      className="markdown-content leading-relaxed text-white"
      dangerouslySetInnerHTML={{
        __html: parsedContent.replace(
          /<(\w+)([^>]*)>/g,
          (match, tag, attrs) =>
            `<${tag} class="${messageStyles[tag] || ""}"${attrs}>`
        ),
      }}
    />
  );
}

export default MessageRenderer;
