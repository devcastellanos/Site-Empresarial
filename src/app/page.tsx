// components
import { Navbar, Footer, BlogPostCard } from "@/components";

// sections
import Hero from "./hero";
import Posts from "./posts";
import Articles from "./articles";

export default function Campaign() {
  return (
    <>
      <Navbar />
      <div className="flex flex-row gap-4 p-4">
        <div className="w-1/3">
          <Hero />
        </div>
        <div className="w-2/3">
          <Articles />
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
