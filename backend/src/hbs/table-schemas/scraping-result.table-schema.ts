export const scrapingResultTableSchema = [
  {
    header: "Link",
    field: "link",
    class: "max-w-[30%]",
    partial: "tableCells/scrapingResultLinkCell"
  },
  {
    header: "Context",
    field: "text",
    class: "px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-[200px]"
  },
  {
    header: "Created At",
    field: "createdAt",
    class: "text-sm text-gray-500",
    partial: "tableCells/dateCell"
  },
];
