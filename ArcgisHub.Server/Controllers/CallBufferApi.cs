using ArcgisHub.Server.models;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace ArcgisHub.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CallBufferApi : Controller
    {
        [HttpPost("callBuffer")]
        public async Task<IActionResult> CallBuffer([FromBody] BufferJsonModel buffers)
        {
            string inputLayer = "";
            //var url = "http://jejgelcvggsdn6mg.maps.arcgis.com/CreateBuffers/submitJob";
            var url = "http://jejgelcvggsdn6mg.maps.arcgis.com/arcgis/rest/services/SpatialAnalysisTools/GPServer/CreateBuffers/submitJob";
            var client = new HttpClient();
            /*string json = System.Text.Json.JsonSerializer.Serialize(buffers, new JsonSerializerOptions
            {
                WriteIndented = true
            });
            var buffer = System.Text.Json.JsonSerializer.Deserialize<BufferJsonModel>(json);*/

            var bufferToSend = new BufferJsonModel
            {
                inputLayer = buffers!.inputLayer,
                distances = buffers.distances,
                units = buffers!.units,
                dissolveType = buffers.dissolveType,
                ringType = buffers.ringType,
                sideType = buffers.sideType,
                endType = buffers.endType
            };

            var json = JsonSerializer.Serialize(bufferToSend);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync(url, content);

            /*var values = new Dictionary<string, string>{
              { "inputLayer", buffer.inputLayer },
              { "units", buffer.units },
              { "userName", "OPPO" },
            };*/

            Console.WriteLine(response);
            return Ok("finalizo");
        }

    }


}


