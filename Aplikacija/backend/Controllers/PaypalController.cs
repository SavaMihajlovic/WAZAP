using PayPalCheckoutSdk.Orders;
using Models;
using PayPalCheckoutSdk.Core;
using Newtonsoft.Json;
using System.Web;

namespace Controllers;


[ApiController]
[Route("[controller]")]
public class PaypalController : ControllerBase
{   
    public Context Context { get; set; }
    private readonly IConfiguration configuration;
    private readonly HttpClient _httpClient;

    public int maxNumberOfReservations {get; set;}
    public int DaysInAdvance { get; set; }

    public double CenaKarte { get; set;}
     public PaypalController(Context context , IConfiguration configuration)
     {
         Context = context;
         this.configuration = configuration;
         _httpClient = new HttpClient();
         CenaKarte = 17.08f;
         
    }
    [HttpPost("MakePaymentLezaljka/{datum}")]
    public async Task<ActionResult> MakePaymentLezaljka([FromBody]List<int> easyChairIDs , DateTime datum)
    {
        try
        {
            string ClientId = configuration.GetSection("PaypalOptions:ClientID").Value!;
            string Secret = configuration.GetSection("PaypalOptions:ClientSecret").Value!;
            string Mode = configuration.GetSection("PaypalOptions:ClientMode").Value!;
            double totalAmount = 0;
            foreach (var easyChairID in easyChairIDs)
            {
            var easyChair = await Context.Lezaljke.FindAsync(easyChairID);
                if (easyChair == null)
                {
                    return BadRequest($"Ležaljka sa ID {easyChairID} nije pronađena");
                }
                totalAmount+=easyChair.Cena;
            }
            double amount = totalAmount; 
            amount = Math.Round(amount, 2);
            string successUrl = "http://localhost:5173/payment-success?";
            foreach (var easyChairID in easyChairIDs)
            {
                
                successUrl += $"easyChairIDs={easyChairID}&";
            }
            string encodedDate = HttpUtility.UrlEncode(datum.ToString());
            successUrl += $"date={encodedDate}";
            PayPalEnvironment environment = Mode == "sandbox" ? new SandboxEnvironment(ClientId , Secret) : new LiveEnvironment(ClientId,Secret);
            var client = new PayPalHttpClient(environment);

        
            var order = new OrderRequest()
            {
                CheckoutPaymentIntent = "CAPTURE",
                ApplicationContext = new ApplicationContext()
                {
                    BrandName = "WAZAP",
                    LandingPage = "LOGIN",
                    UserAction = "PAY_NOW",
                    ReturnUrl = successUrl,
                    CancelUrl = "http://localhost:5173/payment-failure?"
                },
                PurchaseUnits = new List<PurchaseUnitRequest>()
                {
                    new PurchaseUnitRequest()
                    {
                        AmountWithBreakdown = new AmountWithBreakdown()
                        {
                            CurrencyCode = "EUR",
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

    [HttpPost("MakePaymentKarta/{zahtevID}/{tipKarte}/{uverenje}")]
    public async Task<ActionResult> MakePaymentLezaljka(int zahtevID , string tipKarte , bool uverenje)
    {
        try
        {
            if(tipKarte != "mesecna" && tipKarte != "polumesecna")
                return BadRequest("Nevalidna karta");
            string ClientId = configuration.GetSection("PaypalOptions:ClientID").Value!;
            string Secret = configuration.GetSection("PaypalOptions:ClientSecret").Value!;
            string Mode = configuration.GetSection("PaypalOptions:ClientMode").Value!;
            double amount = 0;
            if(tipKarte == "mesecna")
                amount = CenaKarte;
            else
                amount = CenaKarte/2;
            if(uverenje)
                amount -= amount * 0.10f;
            amount = Math.Round(amount, 2);
            string successUrl = $"http://localhost:5173/payment-success?reqID={zahtevID}&typeOfCard={tipKarte}&uverenje={uverenje}";
            PayPalEnvironment environment = Mode == "sandbox" ? new SandboxEnvironment(ClientId , Secret) : new LiveEnvironment(ClientId,Secret);
            var client = new PayPalHttpClient(environment);

        
            var order = new OrderRequest()
            {
                CheckoutPaymentIntent = "CAPTURE",
                ApplicationContext = new ApplicationContext()
                {
                    BrandName = "WAZAP",
                    LandingPage = "LOGIN",
                    UserAction = "PAY_NOW",
                    ReturnUrl = successUrl,
                    CancelUrl = "http://localhost:5173/payment-failure?"
                },
                PurchaseUnits = new List<PurchaseUnitRequest>()
                {
                    new PurchaseUnitRequest()
                    {
                        AmountWithBreakdown = new AmountWithBreakdown()
                        {
                            CurrencyCode = "EUR",
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
            string Mode = configuration.GetSection("PaypalOptions:ClientMode").Value!;
            string accessToken = await GetAccessToken();
            var requestData = new {
                token = accessToken
            };
            string jsonObject = JsonConvert.SerializeObject(requestData);

            HttpRequestMessage request = Mode == "sandbox" ? new HttpRequestMessage(HttpMethod.Post, $"https://api.sandbox.paypal.com/v2/checkout/orders/{token}/capture") : new HttpRequestMessage(HttpMethod.Post, $"https://api.paypal.com/v2/checkout/orders/{token}/capture");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            request.Content = new StringContent(jsonObject, Encoding.UTF8, "application/json");
            


            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();


            if (response.IsSuccessStatusCode)
            {
                return Ok("Uspešno plaćanje!");
            }
            else
            {
                return BadRequest("Neuspešno plaćanje!");
            }
        }
        catch (Exception ex)
        {
            return BadRequest($"Neuspešno plaćanje! Greška:{ex.Message}");
        }
    }
    private async Task<string> GetAccessToken()
    {
        string ClientId = configuration.GetSection("PaypalOptions:ClientID").Value!;
        string Secret = configuration.GetSection("PaypalOptions:ClientSecret").Value!;
        string Mode = configuration.GetSection("PaypalOptions:ClientMode").Value!;
        string credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{ClientId}:{Secret}"));

        HttpRequestMessage request = Mode == "sandbox" ? new HttpRequestMessage(HttpMethod.Post, "https://api-m.sandbox.paypal.com/v1/oauth2/token") : new HttpRequestMessage(HttpMethod.Post, "https://api-m.paypal.com/v1/oauth2/token");
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
            throw new Exception("Dobijanje tokena od PayPal API-ja nije uspešno!");
        }
    }

}