"use client";

import { useHomePageLogic } from "@/hooks/useHomePage";
import { Button } from "@/components/ui/Button";
import { DeleteDialog } from "@/components/Dialogs/DeleteDialog";
import { LoginPrompt } from "@/components/LoginPrompt";
import { PasswordDialog } from "@/components/Dialogs/PasswordDialog";
import { SearchBar } from "@/components/ui/SearchBar";
import { PasswordList } from "@/components/Password/PasswordList";

const HomePage = () => {
  const {
    loading,
    error,
    isLoggedIn,
    filteredPasswords,
    sortedPasswords,
    isDialogOpen,
    setIsDialogOpen,
    setSearchTerm,
    setSortOptions,
    handleEdit,
    handleDelete,
    handleCloseDialog,
    handleAddOrUpdatePassword,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedPassword,
    showPassword,
    setShowPassword,
    showUsername,
    setshowUsername,
    searchTerm,
    setSelectedPassword,
    newPassword,
    setNewPassword,
    sortOptions,
  } = useHomePageLogic();

  if (!isLoggedIn) {
    return <LoginPrompt />;
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 mt-16">
      <main className="container mx-auto">

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOptions={sortOptions}
          setSortOptions={setSortOptions}
          setIsDialogOpen={setIsDialogOpen}
        />

        {loading ? (
          <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        ) : filteredPasswords.length > 0 ? (
          <PasswordList
            passwords={sortedPasswords}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showUsername={showUsername}
            setshowUsername={setshowUsername}
            handleEdit={handleEdit}
            handleDelete={(password) => {
              setSelectedPassword(password);
              setIsDeleteDialogOpen(true);
            }}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-2">No passwords found</div>
            <Button onClick={() => setIsDialogOpen(true)}>
              Add your first password
            </Button>
          </div>
        )}
      </main>

      <PasswordDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleAddOrUpdatePassword}
        newPassword={newPassword}
        setNewPassword={(value) =>
          setNewPassword((prev) => ({ ...prev, ...value }))
        }
        selectedPassword={selectedPassword}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedPassword?.title}
        itemType="Password"
      />
    </div>
  );
};

export default HomePage;
