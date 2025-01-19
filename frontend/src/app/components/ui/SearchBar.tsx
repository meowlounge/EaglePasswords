import { Button } from "../ui/Button";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { Input } from "./Input";
import { Select } from "./Select";

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    sortOptions: { field: "title" | "username" | "createdAt" | "updatedAt" | "strength"; order: "asc" | "desc" };
    setSortOptions: (options: { field: "title" | "username" | "createdAt" | "updatedAt" | "strength"; order: "asc" | "desc" }) => void;
}

export const SearchBar = ({
    searchTerm,
    setSearchTerm,
    sortOptions,
    setSortOptions,
}: SearchBarProps) => {
    const toggleSortOrder = () => {
        setSortOptions({
            ...sortOptions,
            order: sortOptions.order === "asc" ? "desc" : "asc",
        });
    };

    return (
        <div className="flex space-x-2 p-2">
            <Input
                type="search"
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                className="w-full"
            />
            <Select
                value={sortOptions.field}
                onChange={(field) => setSortOptions({ ...sortOptions, field })}
                options={[
                    { value: "title", label: "Title" },
                    { value: "username", label: "Username" },
                    { value: "createdAt", label: "Created At" },
                    { value: "updatedAt", label: "Updated At" },
                    { value: "strength", label: "Strength"}
                ]}
                className="w-48"
            />
            <Button
                icon={sortOptions.order === "asc" ? ChevronUp : ChevronDown}
                content={sortOptions.order === "asc" ? "Ascending" : "Descending"}
                onClick={toggleSortOrder}
            />
        </div>
    );
};
