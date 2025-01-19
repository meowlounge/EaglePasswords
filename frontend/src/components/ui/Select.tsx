import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Props for the Select component.
 * @template T - The type of the value used in the Select component.
 */
interface SelectProps<T> {
    /**
     * The currently selected value.
     */
    value: T;

    /**
     * Callback triggered when the selected value changes.
     * 
     * @param value - The newly selected value.
     */
    onChange: (value: T) => void;

    /**
     * An array of options to display in the dropdown.
     */
    options: { value: T; label: string }[];

    /**
     * Additional classes for custom styling.
     * @default undefined
     */
    className?: string;

    /**
     * Placeholder text to display when no option is selected.
     * @default "Select an option"
     */
    placeholder?: string;
}

/**
 * A custom dropdown Select component with an accessible and modern design.
 * 
 * @template T - The type of the value used in the Select component.
 * @param {SelectProps<T>} props - Props for the Select component.
 * @returns {JSX.Element} The rendered Select component.
 * 
 * @example
 * ```tsx
 * const Example = () => {
 *     const [selected, setSelected] = useState<string>('option1');
 * 
 *     return (
 *         <Select
 *             value={selected}
 *             onChange={setSelected}
 *             options={[
 *                 { value: 'option1', label: 'Option 1' },
 *                 { value: 'option2', label: 'Option 2' },
 *                 { value: 'option3', label: 'Option 3' },
 *             ]}
 *         />
 *     );
 * };
 * ```
 */
export const Select = <T extends string | number>({
    value,
    onChange,
    options,
    className = '',
    placeholder = 'Select an option',
}: SelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((option) => option.value === value);

    return (
        <div ref={selectRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative w-full h-full rounded-xl px-3 py-2
                    bg-neutral-100 border border-neutral-300 text-left text-sm  
                    transition-all duration-200 hover:ring-2 hover:ring-neutral-400/20
                    dark:bg-neutral-800 dark:border-neutral-700 dark:hover:ring-neutral-600/20
                    ${isOpen ? 'ring-2 ring-neutral-400/20 dark:ring-neutral-600/20' : ''}
                `}
            >
                <span
                    className={`block truncate mr-4 ${!selectedOption
                        ? 'text-neutral-500 dark:text-neutral-400'
                        : 'text-neutral-900 dark:text-neutral-100'
                        }`}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown
                        className={`h-4 w-4 text-neutral-500 dark:text-neutral-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
                            }`}
                    />
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-2">
                    <div className="relative">
                        <div className="absolute inset-0 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 shadow-lg ring-1 ring-neutral-200/50 dark:ring-neutral-700/50" />
                        <div className="relative rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1">
                            <ul className="max-h-60 overflow-auto">
                                {options.map((option, index) => (
                                    <li
                                        key={option.value}
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            relative cursor-pointer select-none rounded-md px-2.5 py-2 text-sm
                                            transition-colors duration-150
                                            ${option.value === value
                                                ? 'bg-neutral-200 text-neutral-700 dark:bg-neutral-900/20 dark:text-neutral-100'
                                                : 'text-neutral-900 hover:bg-neutral-200 dark:text-neutral-100 dark:hover:bg-neutral-700/50'
                                            }
                                            ${index === options.length - 1 ? 'mb-0' : 'mb-1'}
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`block truncate ${option.value === value ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                {option.label}
                                            </span>
                                            {option.value === value && (
                                                <Check className="h-4 w-4 text-neutral-700 dark:text-neutral-400 ml-2" />
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};