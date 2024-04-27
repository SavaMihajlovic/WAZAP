using Models;

namespace Controllers;


[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{       
    public Context Context { get; set; }
     public AuthController(Context context)
     {
         Context = context;
     }
     
     
     
}
