export default function NewPostPage() {
  return (
    <main className="container-shell max-w-3xl py-14">
      <div className="card">
        <h1 className="text-3xl font-bold">Create a new post</h1>
        <p className="mt-2 text-muted">Share a tip, ask a question, or post a field-tested setup.</p>
        <form className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>
            <input type="text" className="input" placeholder="What is your best freezer backup plan during an outage?" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>
            <select className="input">
              <option>General Preparedness</option>
              <option>Power Outages</option>
              <option>Water & Filtration</option>
              <option>Food Storage</option>
              <option>Medical</option>
              <option>Comms</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Content</label>
            <textarea className="textarea" placeholder="Share your setup, question, or preparedness strategy..." />
          </div>
          <button type="submit" className="button-primary">Publish post</button>
        </form>
      </div>
    </main>
  );
}
