export const generateSlug = (text: String) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const categoryTableData = [
  {
    fieldLabel: "Id",
    fieldkey: "id",
    sortable: false,
    searchable: false,
  },
  {
    fieldName: "Name",
    fieldkey: "name",
    sortable: false,
    searchable: false,
  },
  {
    fieldName: "Slug",
    fieldkey: "slug",

    sortable: false,
    searchable: false,
  },
  {
    fieldName: "IsActive",
    fieldkey: "isactive",
    sortable: false,
    searchable: false,
  },
  {
    fieldName: "Sort Order",
    fieldkey: "sortorder",
    sortable: false,
    searchable: false,
  },
  {
    fieldName: "ParentId",
    fieldkey: "parentid",
    sortable: false,
    searchable: false,
  },
  {
    fieldName: "Description",
    fieldkey: "description",
    sortable: false,
    searchable: false,
  },
];
