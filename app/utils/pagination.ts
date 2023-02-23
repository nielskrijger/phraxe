export default function getPageSkip(
  request: Request,
  itemsPerPage: number
): number {
  const url = new URL(request.url);
  let page = parseInt(`${url.searchParams.get("page")}`);
  if (Number.isNaN(page) || page <= 0) {
    page = 1;
  }

  return (page - 1) * itemsPerPage;
}
