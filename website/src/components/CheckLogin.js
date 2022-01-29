async function CheckLogin(history){
    //Protect pages from non authorized access
    const response = await fetch("https://the-deal-finder-api.canadaeast.cloudapp.azure.com:5000/check-login", {
      method: 'GET',
      credentials: "include"
    })
    const data = await response.json();
    if(data['result'] === 'not logged in'){
      // Return to home page if not logged in
      history('/')
    }
  }

  export default CheckLogin;