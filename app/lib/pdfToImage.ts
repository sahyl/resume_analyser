// export interface PdfConversionResult {
//   imageUrl: string;
//   file: File | null;
//   error?: string;
// }

// let pdfjsLib: any = null;
// let isLoading = false;
// let loadPromise: Promise<any> | null = null;

// /**
//  * Load PDF.js dynamically on the client only
//  */
// async function loadPdfJs(): Promise<any> {
//   if (typeof window === "undefined") {
//     // Prevent SSR execution
//     throw new Error("PDF.js can only be loaded in the browser.");
//   }

//   if (pdfjsLib) return pdfjsLib;
//   if (loadPromise) return loadPromise;

//   isLoading = true;

//   // Dynamically import pdfjs-dist on the client
//   // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not typed correctly
//   loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
//     // Use the worker from the /public folder
//     lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
//     pdfjsLib = lib;
//     isLoading = false;
//     return lib;
//   });

//   return loadPromise;
// }

// /**
//  * Convert the first page of a PDF into a high-resolution image.
//  */
// export async function convertPdfToImage(
//   file: File
// ): Promise<PdfConversionResult> {
//   try {
//     if (typeof window === "undefined") {
//       // Prevent running during SSR
//       return {
//         imageUrl: "",
//         file: null,
//         error: "PDF conversion can only run in the browser.",
//       };
//     }

//     const lib = await loadPdfJs();
//     if (!lib) {
//       return {
//         imageUrl: "",
//         file: null,
//         error: "Failed to load PDF.js library.",
//       };
//     }

//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
//     const page = await pdf.getPage(1);

//     const viewport = page.getViewport({ scale: 4 });
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");

//     canvas.width = viewport.width;
//     canvas.height = viewport.height;

//     if (context) {
//       context.imageSmoothingEnabled = true;
//       context.imageSmoothingQuality = "high";
//     }

//     await page.render({ canvasContext: context!, viewport }).promise;

//     return new Promise((resolve) => {
//       canvas.toBlob(
//         (blob) => {
//           if (blob) {
//             const originalName = file.name.replace(/\.pdf$/i, "");
//             const imageFile = new File([blob], `${originalName}.png`, {
//               type: "image/png",
//             });

//             resolve({
//               imageUrl: URL.createObjectURL(blob),
//               file: imageFile,
//             });
//           } else {
//             resolve({
//               imageUrl: "",
//               file: null,
//               error: "Failed to create image blob",
//             });
//           }
//         },
//         "image/png",
//         1.0
//       ); // 1.0 = maximum quality
//     });
//   } catch (err) {
//     return {
//       imageUrl: "",
//       file: null,
//       error: `Failed to convert PDF: ${
//         err instanceof Error ? err.message : String(err)
//       }`,
//     };
//   }
// }



export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // Set the worker source to use local file
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 4 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
        }

        await page.render({ canvasContext: context!, viewport }).promise;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Create a File from the blob with the same name as the pdf
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0
            ); // Set quality to maximum (1.0)
        });
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}