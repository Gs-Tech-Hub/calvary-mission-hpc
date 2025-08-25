export default function ContactPage() {
  return (
    <section className="pt-[100px] pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-600 mt-2">We'd love to hear from you.</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-xl shadow bg-white p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in touch</h2>
              <p className="text-gray-600">Send us a message and we will get back to you shortly.</p>
              <form className="mt-6 space-y-4">
                <input type="text" name="name" placeholder="Your Name" className="w-full border rounded-md px-4 py-3" />
                <input type="email" name="email" placeholder="Your Email" className="w-full border rounded-md px-4 py-3" />
                <textarea name="message" placeholder="Your Message" className="w-full border rounded-md px-4 py-3 min-h-[140px]"></textarea>
                <button type="submit" className="w-full h-11 rounded-md bg-blue-600 text-white hover:bg-blue-700">Send</button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl shadow bg-white p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Church Information</h2>
              <ul className="text-gray-700 space-y-2">
                <li><strong>Address:</strong> Our church address</li>
                <li><strong>Email:</strong> info@example.com</li>
                <li><strong>Phone:</strong> +123 456 7890</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


