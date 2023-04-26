import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  ChevronRightIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";

type DropdownProps = {
  items: string[];
  placeholder?: string;
  selected: string;
  onChange(newValue: string): void;
};

export const Dropdown: React.FC<DropdownProps> = function ({
  items,
  selected,
  onChange,
}) {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-transparent bg-controlBackground-light py-2 pl-3 pr-10 text-left shadow-md hover:border hover:border-controlBackground-light focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white active:border-controlBorderHighlight-dark ui-open:border-controlActive-light dark:bg-controlBackground-dark dark:hover:border-controlBorderHighlight-dark dark:ui-open:border-controlActive-dark sm:text-sm">
          <span className="block truncate text-base font-normal">
            {selected}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-icon-light dark:text-icon-dark"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md  bg-controlBackground-light py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-controlBackground-dark sm:text-sm">
            {items.map((item, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-4 pr-4 font-normal ${
                    active
                      ? "bg-controlActive-light dark:bg-controlActive-dark dark:text-content-dark"
                      : "text-contentSecondary-light dark:text-contentSecondary-dark"
                  }`
                }
                value={item}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate text-sm ${
                        selected ? "font-bold" : ""
                      }`}
                    >
                      {item}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
