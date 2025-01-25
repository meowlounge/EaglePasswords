/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import Papa from "papaparse";
import { addPassword } from "@/lib/api";
import { Password } from "@/types";
import { FileInput } from "lucide-react";
import { Select } from "../ui/Select";

interface CSVRow {
  name?: string;
  website?: string;
  username: string;
  secondary_username?: string;
  password: string;
  notes?: string;
}

/**
 * DataImporter is a component that handles importing password data from either CSV or JSON format.
 * It validates the file, skips invalid rows, and adds valid rows to the password storage.
 *
 * @param {boolean} isOpen - Determines if the dialog is open.
 * @param {() => void} onClose - Callback to close the dialog.
 * @param {() => void} onImportSuccess - Callback to execute on successful import.
 * @returns JSX.Element
 */
export const DataImporter = ({
  isOpen,
  onClose,
  onImportSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [skippedRows, setSkippedRows] = useState<number[]>([]);
  const [importFormat, setImportFormat] = useState<"csv" | "json">("csv");

  /**
   * Handles the file selection and updates the state accordingly.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSkippedRows([]);
    }
  };

  /**
   * Validates and processes the CSV file by skipping rows with missing necessary data.
   * Valid rows are added to the password storage.
   */
  const handleImport = async () => {
    if (!file) {
      setError("No file selected");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSkippedRows([]);

    if (importFormat === "csv") {
      Papa.parse(file, {
        complete: async (result) => {
          const parsedData = result.data as CSVRow[];
          const skipped: number[] = [];

          try {
            for (let i = 0; i < parsedData.length; i++) {
              const row = parsedData[i];

              if (!row.username || !row.password) {
                skipped.push(i + 1);
                continue;
              }

              const passwordData: Omit<Password, "id"> = {
                title: row.name || row.website || "",
                username: row.username,
                password: row.password,
                url: row.website,
                note: row.notes,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              await addPassword(passwordData);
            }

            onImportSuccess();
            onClose();
            if (skipped.length > 0) {
              setError(`The following rows were skipped: ${skipped.join(", ")}`);
            }
          } catch (error) {
            setError("Failed to upload passwords. Please try again.");
            console.error("Error during password upload:", error);
          } finally {
            setIsUploading(false);
          }
        },
        error: () => {
          setError(
            "Error parsing CSV file. Ensure the file is in a valid CSV format.",
          );
          setIsUploading(false);
          console.error("Error parsing CSV file");
        },
        header: true,
        skipEmptyLines: true,
      });
    } else if (importFormat === "json") {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const parsedData = JSON.parse(reader.result as string);
          const skipped: number[] = [];

          for (let i = 0; i < parsedData.length; i++) {
            const row = parsedData[i];

            if (!row.username || !row.password) {
              skipped.push(i + 1);
              continue;
            }

            const passwordData: Omit<Password, "id"> = {
              title: row.title || "",
              username: row.username || "",
              password: row.password || "",
              url: row.url || "",
              note: row.note || "",
              createdAt: row.createdAt || new Date().toISOString(),
              updatedAt: row.updatedAt || new Date().toISOString(),
            };

            if (!passwordData.username || !passwordData.password) {
              skipped.push(i + 1);
              continue;
            }

            await addPassword(passwordData);
          }

          onImportSuccess();
          onClose();
          if (skipped.length > 0) {
            setError(`The following rows were skipped: ${skipped.join(", ")}`);
          }
        } catch (error) {
          setError("Failed to parse JSON file. Ensure the file is in a valid format.");
          console.error("Error parsing JSON file:", error);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Import Passwords">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-neutral-700 dark:text-neutral-100">Choose Import Format</label>
          <Select
            value={importFormat}
            onChange={(value) => setImportFormat(value as "csv" | "json")}
            options={[
              { value: "csv", label: "CSV" },
              { value: "json", label: "JSON (Currently Dev Only)" },
            ]}
            className="mt-2"
          />
        </div>

        <div>
          <Input
            type="file"
            accept={importFormat === "csv" ? ".csv" : ".json"}
            onChange={handleFileChange}
            icon={FileInput}
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            onClick={handleImport}
            disabled={isUploading || !file}
            loading={isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : `Import ${importFormat.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};