namespace ArcgisHub.Server.models
{
    public class BufferJsonModel
    {
        public InputLayer inputLayer { get; set; } = null!;
        //no se usa
        public int[] distances { get; set; } = null!;
        public string units { get; set; } = null!;
        public string dissolveType { get; set; } = null!;
        public string ringType { get; set; } = null!;
        public string sideType { get; set; } = null!;
        public string endType { get; set; } = null!;

    }

    public class InputLayer
    {
        public List<Features> features { get; set; } = null!; // list o array ?
    }

    public class Features
    {
        public Geometry geometry { get; set; } = null!;
    }

    public class Geometry
    {
        public List<List<double>> path { get; set; } = null!;
    }


}


