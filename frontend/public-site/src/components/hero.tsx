import {org} from "@/lib/org";

export default function Hero() {
  return (
    <section
      className="relative pt-[80px] md:pt-[100px] text-white overflow:hidden;"
      style={{
        backgroundImage: `url(${org.heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      
      <div className="absolute inset-0 bg-[#0A1D3C]/80 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between">
      
        <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 relative inline-block">
            <span className="before:absolute before:-left-8 before:top-1/2 before:w-8 before:h-[6px] before:bg-[#dbdbdd] after:absolute after:-right-8 after:top-1/2 after:w-8 after:h-[6px] after:bg-[#dbdbdd]">
              {org.heroText.title}
            </span>
          </h1>
          <p className="text-lg mb-6">{org.heroText.subtitle}</p>
          <button
            className="px-6 py-3 border-2 border-white text-white rounded-md transition-all hover:bg-white hover:text-[#0A1D3C]"
            style={{ boxShadow: "0 0 15px #2563eb" }}
          >
            Go to Sermons
          </button>

           <button
            className="px-6 py-3 border-2 ml-4 border-white text-white rounded-md transition-all hover:bg-white hover:text-[#0A1D3C]"
            style={{ boxShadow: "0 0 15px #2563eb" }}
          >
            Live Service
          </button>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <div className="rounded-lg overflow-hidden shadow-lg max-w-md w-full">
            <video
              className="w-full h-auto rounded-lg"
              controls
              poster="/video-thumbnail.jpg"
            >
              <source src="/sermon-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
