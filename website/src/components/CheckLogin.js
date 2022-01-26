async function CheckLogin(history){
    //Protect pages from non authorized access
    const response = await fetch("/check-login", {
      method: 'GET',
    })
    const data = await response.json();
    if(data['result'] === 'not logged in'){
      // Return to home page if not logged in
      history('/')
    }
  }

  export default CheckLogin;