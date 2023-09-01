import { type PropFunction, component$ } from "@builder.io/qwik";

type FilterButtonProps = {
  /** The label to display on the button. */
  label: string;
  /** The title (tooltip) to present with the button. */
  title: string;
  /** Whether the filter is currently active. */
  active: boolean;
  /** The callback to invoke to toggle the filter. */
  toggleFilter$: PropFunction<() => void>;
};

/** A button to toggle a filter. */
export default component$<FilterButtonProps>(
  ({ label, title, active, toggleFilter$ }) => {
    return (
      <button
        class={`flex-shrink-0 font-medium px-3 py-1 rounded-full transition-colors ${
          active
            ? "bg-blue-700 text-white hover:bg-blue-800 dark:hover:bg-blue-600"
            : "bg-gray-200 text-gray-400 hover:text-gray-500 dark:bg-slate-700 dark:text-slate-500 dark:hover:text-slate-400"
        }`}
        onClick$={toggleFilter$}
        title={title}
      >
        {label}
      </button>
    );
  }
);
