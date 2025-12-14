"""MIT License

Copyright (c) 2025 Akihiro Ueda

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""
from PIL import Image
import os

def resize_icon(input_path="icon.png", output_dir=".", sizes=[16, 48, 128]):
    """
    Resize the specified image to multiple sizes and save them.

    Args:
        input_path (str): Path to the image to resize (e.g., "icon.png").
        output_dir (str): Directory to save the resized images.
                          Default is current directory.
        sizes (list): List of pixel sizes to generate (e.g., [16, 48, 128]).
    """
    if not os.path.exists(input_path):
        print(f"Error: '{input_path}' not found.")
        return

    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory '{output_dir}'.")

    try:
        with Image.open(input_path) as img:
            print(f"Opened '{input_path}'.")
            for size in sizes:
                # Resize
                resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
                
                # New filename (e.g., icon_16x16.png)
                base_name, ext = os.path.splitext(os.path.basename(input_path))
                output_filename = f"{base_name}_{size}x{size}{ext}"
                output_path = os.path.join(output_dir, output_filename)
                
                # Save
                resized_img.save(output_path)
                print(f"Saved to '{output_path}'.")
        
        print("\nAll resizing completed.")

    except Exception as e:
        print(f"Error occurred during image processing: {e}")

if __name__ == "__main__":
    resize_icon(input_path="icon.png", output_dir=".", sizes=[16, 48, 128])
