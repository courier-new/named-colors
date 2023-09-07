import { type QwikJSX, Slot, component$ } from "@builder.io/qwik";

type ButtonProps = {
  variant?: "primary" | "secondary";
};

export default component$<QwikJSX.IntrinsicElements["button"] & ButtonProps>(
  ({ variant = "primary", ...props }) =>
    variant === "primary" ? (
      <button
        {...props}
        class={`bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white dark:disabled:text-slate-500 hover:bg-blue-800 disabled:hover:bg-gray-300 dark:hover:bg-blue-600 dark:disabled:hover:bg-slate-700 disabled:hover:cursor-not-allowed py-3 px-4 rounded-md ${props.class}`}
      >
        <Slot />
      </button>
    ) : (
      <button
        {...props}
        class={`bg-white text-gray-700 disabled:text-gray-300 dark:disabled:text-slate-700 hover:bg-gray-100 disabled:hover:bg-white dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-blue-950 dark:disabled:hover:bg-slate-900 disabled:hover:cursor-not-allowed py-3 px-4 border-solid border-gray-200 dark:border-slate-700 border-2 rounded-md ${props.class}`}
      >
        <Slot />
      </button>
    )
);
