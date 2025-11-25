export default function IntroPane() {
  return (
    <div className="bg-neutral-900 h-full w-full flex flex-col gap-2 sm:gap-4 xl:gap-6 px-6 py-4 rounded-b-2xl lg:rounded-r-2xl">
      <h1 className="text-xl xl:text-2xl 2xl:text-4xl font-bold">filewell</h1>
      <p className="text-sm xl:text-base">
        A minimal file system with no backend; uses recursive structure, like
        <span className="italic"> moti miah</span>'s bottomless well of sorrow.
      </p>
    </div>
  );
}
