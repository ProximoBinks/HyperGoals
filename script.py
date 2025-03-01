import os

def list_files_in_folder(folder_path):
    try:
        # List all files in the directory
        files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
        
        if files:
            print("Files in folder:")
            for file in files:
                print(file)
        else:
            print("No files found in the folder.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    folder_path = r"C:\\Users\\User\\Documents\\GitHub\\HyperGoals\\public\\fonts"
    list_files_in_folder(folder_path)