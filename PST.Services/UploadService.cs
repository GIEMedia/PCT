using System;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using GhostscriptSharp;
using Prototype1.Foundation;
using PST.Declarations.Interfaces;
using iTextSharp.text.pdf;

namespace PST.Services
{
    public class UploadService : IUploadService
    {
        private static readonly string UploadFolderBase = HostingEnvironment.MapPath("~/Content/");

        private static readonly string BaseUrl =
            ConfigurationManager.AppSettings["BaseUrl"].Replace("http://", "//").Replace("https://", "//") + "Content/";

        public async Task<string> UploadImage(HttpContent requestContent, int? width = null, int? height = null, bool forceCanvas = false)
        {
            var file = await UploadFile(requestContent, "Images\\");

            var fileName = file.Name;

            if ((width.HasValue || height.HasValue))
            {
                fileName = ResizeImage(file, ImageFormat.Jpeg, width, height, forceCanvas);
                try { File.Delete(file.Name); }
                catch { }
            }

            var url = string.Concat(BaseUrl, "Images/", fileName);
            return url;
        }

        public async Task<Tuple<Guid, int>> UploadDocument(HttpContent requestContent)
        {
            var file = await UploadFile(requestContent, "Documents\\");

            int pageCount;
            var docGuid = ProcessPDF(file.FullName, out pageCount);

            return new Tuple<Guid, int>(docGuid, pageCount);
        }

        private async Task<FileInfo> UploadFile(HttpContent requestContent, string uploadTypePath)
        {
            var provider = GetMultipartProvider("Images\\");
            var result = await requestContent.ReadAsMultipartAsync(provider);
            return new FileInfo(result.FileData.First().LocalFileName);
        }

        private static MultipartFormDataStreamProvider GetMultipartProvider(string uploadTypePath)
        {
            var root = UploadFolderBase + uploadTypePath;
            return new CustomMultipartFormDataStreamProvider(root);
        }

        private class CustomMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
        {
            public CustomMultipartFormDataStreamProvider(string rootPath)
                : base(rootPath)
            {
            }

            public override string GetLocalFileName(HttpContentHeaders headers)
            {
                if (headers == null)
                {
                    throw new ArgumentNullException("headers");
                }

                return string.Format("{0}.{1}", Guid.NewGuid(),
                    headers.ContentDisposition.FileName.Split('.').Last().Trim('"'));
            }
        }

        #region Image Processing

        private static string ResizeImage(FileSystemInfo file, ImageFormat imageFormat, int? origWidth, int? origHeight, bool forceCanvas)
        {
            if (!origHeight.HasValue && !origWidth.HasValue)
                throw new ArgumentNullException("You must specifiy either origHeight or origWidth");

            var image = CropImageWithoutWhitespace(new Bitmap(System.Drawing.Image.FromFile(file.FullName)));

            if (!origHeight.HasValue)
            {
                forceCanvas = false;
                origHeight = (int)((origWidth.Value * image.Height) / (decimal)image.Width);
            }

            if (!origWidth.HasValue)
            {
                forceCanvas = false;
                origWidth = (int)((origHeight.Value * image.Width) / (decimal)image.Height);
            }

            var width = origWidth.Value;
            var height = origHeight.Value;

            var drawPosition = new Point(0, 0);

            var ratioX = (double)width / image.Width;
            var ratioY = (double)height / image.Height;
            var ratio = Math.Min(ratioX, ratioY);
            var resizeSize = new Size((int)(image.Width * ratio).Round(true, 0),
                (int)(image.Height * ratio).Round(true, 0));

            if (forceCanvas)
            {
                // determine position of the unequal side
                if (resizeSize.Height == height) // center horizontally
                    drawPosition.X = (int)((width - resizeSize.Width) / 2M);
                else // center vertically
                    drawPosition.Y = (int)((height - resizeSize.Height) / 2M);
            }

            var canvas = forceCanvas ? new Bitmap(width, height) : new Bitmap(resizeSize.Width, resizeSize.Height);

            using (var graphic = Graphics.FromImage(canvas))
            {
                graphic.DrawImage(image,
                    drawPosition.X, drawPosition.Y,
                    resizeSize.Width, resizeSize.Height);
            }

            var fileName = Guid.NewGuid() + (forceCanvas ? ".png" : file.Extension);
            var filePath = file.FullName.Remove(file.FullName.Length - file.Name.Length) + fileName;
            canvas.Save(filePath, forceCanvas ? ImageFormat.Png : imageFormat);

            return fileName;
        }

        private static Bitmap CropImageWithoutWhitespace(Bitmap original)
        {
            var newLeft = FindNonWhitespace(original, 0, original.Width, 0, original.Height, true);
            var newTop = FindNonWhitespace(original, 0, original.Height, 0, original.Width, false);
            var newRight = FindNonWhitespace(original, original.Width - 1, 0, 0, original.Height, true);
            var newBottom = FindNonWhitespace(original, original.Height - 1, 0, 0, original.Width, false);

            var newBitmap = new Bitmap(newRight - newLeft, newBottom - newTop);

            using (var graphic = Graphics.FromImage(newBitmap))
                graphic.DrawImage(original, newLeft * -1, newTop * -1);

            return newBitmap;
        }

        private static int FindNonWhitespace(Bitmap original, int startX, int endX, int startY, int endY, bool horizontalSearch)
        {
            var newVal = -1;
            for (var x = startX; startX < endX ? x < endX : x > endX; x = startX < endX ? x + 1 : x - 1)
            {
                for (var y = startY; startY < endY ? y < endY : y > endY; y = startY < endY ? y + 1 : y - 1)
                {
                    var color = horizontalSearch ? original.GetPixel(x, y) : original.GetPixel(y, x);
                    if ((color.R == 255 && color.G == 255 && color.B == 255) || color.A == 0) continue;
                    newVal = x;
                    break;
                }
                if (newVal != -1)
                    break;
            }
            return newVal;
        }

        #endregion

        #region Document Processing

        public static Guid ProcessPDF(string pdfFilePath, out int pageCount)
        {
            var pdfFile = new FileInfo(pdfFilePath);
            if (!pdfFile.Extension.Equals(".pdf", StringComparison.CurrentCultureIgnoreCase))
            {
                pageCount = 0;
                return Guid.Empty;
            }

            var g = Guid.NewGuid();
            var path = UploadFolderBase + "Documents\\";

            // Rename the pdf file to the GUID that will match the images
            pdfFilePath = path + g + ".pdf";
            pdfFile.MoveTo(pdfFilePath);

            pageCount = CountPDFPages(pdfFilePath);
            var outputFileName = path + g + "_%d.jpg";
            try
            {
                GhostscriptWrapper.GeneratePageThumbs(pdfFilePath, outputFileName, 1, pageCount, 300, 300);
                var fileGuidList = Directory.GetFiles(path, "*" + g + "*.jpg").Select(Path.GetFileName);
                foreach (var item in fileGuidList)
                    try
                    {
                        using (var image = Image.FromFile(path + item))
                            if (image.Width > 1300)
                            {
                                var newImage = ScaleImage(image, 1300, image.Height);
                                image.Dispose();
                                File.Delete(path + item);
                                newImage.Save(path + item, ImageFormat.Jpeg);
                            }
                    }
                    catch
                    {
                    }
            }
            catch
            {
            }

            return g;
        }

        public static int CountPDFPages(string pdfFileNamePath)
        {
            using (var reader = new PdfReader(pdfFileNamePath))
                return reader.NumberOfPages;
        }

        public static Image ScaleImage(Image image, int maxWidth, int maxHeight)
        {
            var ratioX = (double)maxWidth / image.Width;
            var ratioY = (double)maxHeight / image.Height;
            var ratio = Math.Min(ratioX, ratioY);
            var newWidth = (int)(image.Width * ratio);
            var newHeight = (int)(image.Height * ratio);
            var newImage = new Bitmap(newWidth, newHeight);
            try
            {
                Graphics.FromImage(newImage).DrawImage(image, 0, 0, newWidth, newHeight);
            }
            catch
            {
            }
            return newImage;
        }

        #endregion
    }
}