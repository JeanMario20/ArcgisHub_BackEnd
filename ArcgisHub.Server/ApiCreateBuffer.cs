namespace ArcgisHub.Server
{
    public class ApiCreateBuffer
    {
        private static HttpClient sharedClient = new()
        {
            BaseAddress = new Uri("http://jejgelcvggsdn6mg.maps.arcgis.com/CreateBuffers/submitJob"),
        };


    }
}
