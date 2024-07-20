export const keywordsTableSchema = [
  {
    header: "Keyword",
    field: "keyword",
    class: "text-sm font-medium text-gray-900"
  },
  {
    header: "Created At",
    field: "createdAt",
    class: "text-sm text-gray-500",
    partial: "tableCells/dateCell"
  },
  {
    header: "Action",
    field: "createdAt",
    class: "text-sm text-gray-500",
    partial: "tableCells/actionKeywordCell"
  }
];
