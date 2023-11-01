import os
import json

path = os.path.expanduser("~/.fairyring/data")

import shutil



# Make sure the path exists
if not os.path.exists(path):
    print(f"Path {path} does not exist!")
else:
    # Removing all files and directories except .json files
    for filename in os.listdir(path):
        if not filename.endswith(".json"):
            file_path = os.path.join(path, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                    print(f"Deleted file {file_path}")
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
                    print(f"Deleted folder {file_path}")
            except Exception as e:
                print(f"Failed to delete {file_path}: {e}")

    
    new_content = {
      "height": "0",
      "round": 0,
      "step": 0
    }

    for filename in os.listdir(path):
        if filename.endswith(".json"):
            file_path = os.path.join(path, filename)
            with open(file_path, 'w') as file:
                json.dump(new_content, file)
                print(f"Updated {file_path}")

    print("Operation completed successfully!")
