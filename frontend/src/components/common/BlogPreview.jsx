const BlogPreview = () => {
  return (
    <section className="p-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4">Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Article Title</h3>
            <p>Short excerpt of the blog post.</p>
            <a href="#" className="text-blue-600">Read More</a>
          </div>
          {/* Add more blog previews as needed */}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
