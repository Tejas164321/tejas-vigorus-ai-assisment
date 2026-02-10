# Real External API Integration Examples

This document shows how to integrate the ServerDataTable with different external API structures.

## Example 1: JSONPlaceholder API (Todos)

### API Response Format:
```json
{
  "todos": [...],
  "total": 200,
  "skip": 0,
  "limit": 10
}
```

### Implementation:

```typescript
// 1. Define type matching API
interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

// 2. Create columns
const todoColumns: ColumnDef<Todo>[] = [
  {
    accessorKey: 'id',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} title="ID" onSort={(table.options.meta as any)?.onSort} />
    ),
  },
  {
    accessorKey: 'todo',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} title="Task" onSort={(table.options.meta as any)?.onSort} />
    ),
  },
  {
    accessorKey: 'completed',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} title="Status" onSort={(table.options.meta as any)?.onSort} />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue('completed') ? 'default' : 'outline'}>
        {row.getValue('completed') ? 'Done' : 'Pending'}
      </Badge>
    ),
  },
];

// 3. Fetch function (external API)
async function fetchTodos(state: TableState) {
  const skip = (state.page - 1) * state.limit;
  
  const params = new URLSearchParams({
    limit: state.limit.toString(),
    skip: skip.toString(),
  });

  if (state.search) {
    params.set('q', state.search);
  }

  const res = await fetch(`https://dummyjson.com/todos?${params}`);
  return res.json();
}

// 4. Data adapter (transform their structure to ours)
function todosAdapter(response: any): PaginatedResponse<Todo> {
  return {
    data: response.todos,              // API uses "todos"
    total: response.total,             // API uses "total"
    page: Math.floor(response.skip / response.limit) + 1,  // Calculate from skip
    limit: response.limit,
    totalPages: Math.ceil(response.total / response.limit),
  };
}

// 5. Use it
<ServerDataTable<Todo>
  columns={todoColumns}
  fetchFunction={fetchTodos}
  dataAdapter={todosAdapter}
  searchPlaceholder="Search todos..."
/>
```

---

## Example 2: GitHub API (Repositories)

### API Response Format:
```json
{
  "items": [...],
  "total_count": 5000,
  "incomplete_results": false
}
```

### Implementation:

```typescript
// 1. Define type
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  language: string;
}

// 2. Columns
const repoColumns: ColumnDef<GitHubRepo>[] = [
  {
    accessorKey: 'full_name',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} title="Repository" onSort={(table.options.meta as any)?.onSort} />
    ),
  },
  {
    accessorKey: 'language',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} title="Language" onSort={(table.options.meta as any)?.onSort} />
    ),
  },
  {
    accessorKey: 'stargazers_count',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} title="Stars" onSort={(table.options.meta as any)?.onSort} />
    ),
    cell: ({ row }) => `⭐ ${row.getValue('stargazers_count')}`,
  },
];

// 3. Fetch function
async function fetchRepos(state: TableState) {
  const params = new URLSearchParams({
    q: state.search || 'react',  // GitHub requires a search query
    page: state.page.toString(),
    per_page: state.limit.toString(),
  });

  if (state.sortBy) {
    params.set('sort', state.sortBy);
    params.set('order', state.sortOrder || 'asc');
  }

  const res = await fetch(`https://api.github.com/search/repositories?${params}`);
  return res.json();
}

// 4. Data adapter
function reposAdapter(response: any): PaginatedResponse<GitHubRepo> {
  const total = Math.min(response.total_count, 1000); // GitHub limits to 1000
  
  return {
    data: response.items,              // GitHub uses "items"
    total: total,
    page: parseInt(response.page || '1'),
    limit: parseInt(response.per_page || '10'),
    totalPages: Math.ceil(total / (response.per_page || 10)),
  };
}

// 5. Use it
<ServerDataTable<GitHubRepo>
  columns={repoColumns}
  fetchFunction={fetchRepos}
  dataAdapter={reposAdapter}
  searchPlaceholder="Search GitHub repos..."
/>
```

---

## Example 3: Your Own Backend API

### If your API returns:
```json
{
  "records": [...],
  "pagination": {
    "currentPage": 1,
    "totalRecords": 500,
    "recordsPerPage": 20,
    "totalPages": 25
  }
}
```

### Implementation:

```typescript
function yourApiAdapter(response: any): PaginatedResponse<YourType> {
  return {
    data: response.records,                          // Your key
    total: response.pagination.totalRecords,         // Your key
    page: response.pagination.currentPage,           // Your key
    limit: response.pagination.recordsPerPage,       // Your key
    totalPages: response.pagination.totalPages,      // Your key
  };
}
```

---

## Common API Patterns Handled:

### ✅ Pagination Styles:
- **Offset-based**: `?offset=20&limit=10`
- **Page-based**: `?page=2&per_page=10`
- **Cursor-based**: Adapt in fetchFunction

### ✅ Different Response Keys:
- `data`, `items`, `results`, `records`, `todos`, etc.
- `total`, `count`, `total_count`, `totalRecords`, etc.

### ✅ Sorting Formats:
- `?sort_by=name&sort_order=asc`
- `?sort=name&order=asc`
- `?orderBy=name:asc`

### ✅ Filter Formats:
- Query params: `?status=active&role=admin`
- Object: `?filter={status:'active'}`
- Array: `?filter[]=status:active`

---

## Summary:

**The table is 100% flexible for ANY external API.**

You just need to:
1. ✅ Define columns once (based on your data structure)
2. ✅ Write fetchFunction (call your API)
3. ✅ Write dataAdapter (transform response keys)

**The table itself never changes!**
