import { Slot, component$ } from "@builder.io/qwik";

export default component$<{ classes?: string }>(({ classes = "" }) => (
  <div
    class={`w-full md:w-4/5 lg:w-3/5 xl:w-3/7 mx-auto flex flex-col justify-center items-center text-center ${classes}`}
    style={{ minHeight: "70vh" }}
  >
    <Slot />
  </div>
));
