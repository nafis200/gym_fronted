import BlogForm from "../../_components/BlogForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BlogForm mode="edit" blogId={Number(id)} />;
}