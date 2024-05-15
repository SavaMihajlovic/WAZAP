using PayPalCheckoutSdk.Orders;
using Models;
using PayPalCheckoutSdk.Core;
using Newtonsoft.Json;

namespace Controllers;


[ApiController]
[Route("[controller]")]
public class PaypalController : ControllerBase
{   
    public Context Context { get; set; }
    private readonly IConfiguration configuration;
    private readonly HttpClient _httpClient;
     public PaypalController(Context context , IConfiguration configuration)
     {
         Context = context;
         this.configuration = configuration;
         _httpClient = new HttpClient();
         
    }
    [HttpPost("MakePayment/{easyChairID}")]
    public async Task<ActionResult> MakePayment(int easyChairID)
    {
        try
        {
            string ClientId = configuration.GetSection("PaypalOptions:ClientID").Value!;
            string Secret = configuration.GetSection("PaypalOptions:ClientSecret").Value!;
            string Mode = configuration.GetSection("PaypalOptions:Mode").Value!;
            var easyChair = await Context.Lezaljke.FindAsync(easyChairID);
            if (easyChair == null)
                return BadRequest("Lezaljka nije nadjena");

            double amount = easyChair.Cena; // Cena ležaljke
            // Konfiguracija Paypala
            var environment = new SandboxEnvironment(ClientId , Secret);
            var client = new PayPalHttpClient(environment);

            // Kreiranje narudzbine
            var order = new OrderRequest()
            {
                CheckoutPaymentIntent = "CAPTURE",
                ApplicationContext = new ApplicationContext()
                {
                    BrandName = "WAZAP",
                    LandingPage = "LOGIN",
                    UserAction = "PAY_NOW",
                    ReturnUrl = "http://localhost:5173",
                    CancelUrl = "http://localhost:5173/login"
                },
                PurchaseUnits = new List<PurchaseUnitRequest>()
                {
                    new PurchaseUnitRequest()
                    {
                        AmountWithBreakdown = new AmountWithBreakdown()
                        {
                            CurrencyCode = "USD",
                            Value = amount.ToString()
                        }
                    }
                }
            };
            var request = new OrdersCreateRequest();
            request.Prefer("return=representation");
            request.RequestBody(order);
            var response = await client.Execute(request);
            var statusCode = response.StatusCode;

            if (statusCode == HttpStatusCode.Created)
            {
                var result = response.Result<Order>();
                var approvalUrl = result.Links.First(link => link.Rel == "approve").Href;
                return Ok(approvalUrl);
            }
            else
            {
                return StatusCode((int)statusCode, "Neuspela kreacija narudžbine");
            }
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
     }
    [HttpPost("ConfirmOrder/{token}")]
    public async Task<ActionResult> ConfirmOrder(string token)
    {
        try
        {
            // Dobijanje access tokena
            string accessToken = await GetAccessToken();
            Console.WriteLine(accessToken);
            var requestData = new {
                token = accessToken
            };
            string jsonObject = JsonConvert.SerializeObject(requestData);
            // Kreiranje HTTP zahteva za potvrdu narudžbine
            var request = new HttpRequestMessage(HttpMethod.Post, $"https://api.sandbox.paypal.com/v2/checkout/orders/{token}/capture");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            request.Content = new StringContent(jsonObject, Encoding.UTF8, "application/json");
            

            // Slanje zahteva PayPal API-ju
            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            // Provera odgovora
            if (response.IsSuccessStatusCode)
            {
                return Ok("Uspesno placanje!");
            }
            else
            {
                return BadRequest("Neuspesno placanje!");
            }
        }
        catch (Exception ex)
        {
            return BadRequest($"Neuspesno placanje! Greška: {ex.Message}");
        }
    }
    private async Task<string> GetAccessToken()
    {
        string ClientId = configuration.GetSection("PaypalOptions:ClientID").Value!;
        string Secret = configuration.GetSection("PaypalOptions:ClientSecret").Value!;
        string credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{ClientId}:{Secret}"));

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api-m.sandbox.paypal.com/v1/oauth2/token");
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);
        request.Content = new StringContent("grant_type=client_credentials", Encoding.UTF8, "application/x-www-form-urlencoded");

        var response = await _httpClient.SendAsync(request);
        if (response.IsSuccessStatusCode)
        {
            var json = await response.Content.ReadAsStringAsync();
            dynamic data = JsonConvert.DeserializeObject(json)!;
            return data.access_token;
        }
        else
        {
            throw new Exception("Failed to get access token from PayPal API.");
        }
    }

}