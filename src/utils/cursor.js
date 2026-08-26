export const encodeCursor = (product) => {
    const cursorData = {
    createdAt: product.createdAt.toISOString(),
    id: product._id.toString(),
  };

  return Buffer.from(
    JSON.stringify(cursorData)
  ).toString("base64");
}

export const decodeCursor = (cursor) => {
  try {
    const decoded = Buffer.from(
      cursor,
      "base64"
    ).toString("utf-8");

    return JSON.parse(decoded);
  } catch {
    return null;
  }
};