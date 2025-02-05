import {
  Typography,
  IconButton,
  Input,
  Button,
} from "@material-tailwind/react";

const CURRENT_YEAR = new Date().getFullYear();


export function Footer() {
  return (
    <footer className="pb-5 p-10 md:pt-10">
      <div className="container flex flex-col mx-auto">
        <div className="flex !w-full py-10 mb-5 md:mb-20 flex-col justify-center !items-center bg-gray-900 container max-w-6xl mx-auto rounded-2xl p-5 ">
          <Typography
           placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
            className="text-2xl md:text-3xl text-center font-bold "
            color="white"
          >
            Join our community!
          </Typography>
          <Typography
            color="white"
            className=" md:w-7/12 text-center my-3 !text-base"
            placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          >
            Get news in your inbox every week! We hate spam too, so no worries
            about this.
          </Typography>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-80">
              {/* @ts-ignore */}
              <Input label="Email" color="white" />
            </div>
            <Button 
              size="md" 
              className="lg:w-32" 
              fullWidth 
              color="white" 
              placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
            >
              subscribe
            </Button>
          </div>
        </div>

        <Typography
         placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          color="blue-gray"
          className="text-center mt-12 font-normal !text-gray-700" 
        >
          &copy; {CURRENT_YEAR} Made by{" "}
          <a href=" " target="_blank">
          Sistemas Tarahumara
          </a>
          .
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
