import { component$ } from "@builder.io/qwik";
import { GoHeartFill24 } from "@qwikest/icons/octicons";

export default component$(() => {
  return (
    <footer class="z-50 block fixed bottom-0 w-full text-xs text-gray-400 dark:text-slate-500 text-center py-5 bg-gray-50 dark:bg-slate-800">
      Made with{" "}
      <GoHeartFill24 class="text-pink-300 dark:text-pink-600 inline-block -mt-0.5" />{" "}
      by{" "}
      <a
        class="text-gray-800 dark:text-slate-300"
        href="https://github.com/courier-new"
        target="_blank"
      >
        courier-new
      </a>
      .
    </footer>
  );
});
