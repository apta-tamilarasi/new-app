var selectparent
var selectshild
var contacts
var get_custom_data=[]
window.onload = function () {
  console.log('trigger');
  ZFAPPS.extension.init().then(function (App) {
    console.log(App);
    module_data_get()

    contacts = {
      url: 'https://www.zohoapis.com/books/v3/contacts?organization_id=830021604',
      method: "GET",
      body: {
        mode: 'raw',
        raw: 'RAWDATA'
      },
      connection_link_name: 'zohobookscontact'
    };
    console.log(contacts)

    var parentselect = document.getElementById('parent-select')
  
    ZFAPPS.request(contacts).then(function (value) {
      let responseJSON = JSON.parse(value.data.body);
      console.log(responseJSON);

      contacts = responseJSON.contacts
      console.log(contacts);

      let parent_contact_details = contacts.map((e, i) => {
        console.log('parent-map');
        if(i==0){
          selectparent=e.contact_name
        }
        var parent_opt = document.createElement('option')
        parent_opt.textContent = e.contact_name
        parent_opt.value = e.contact_name
        parentselect.append(parent_opt)
      })
      opt(selectparent,contacts)
      
    console.log(get_custom_data);
    

    }).catch(function (err) {
      console.log("request err", err);
    })
  })


}

let save_the_details = () => {

  var parentselect = document.getElementById('parent-select')
  var childselect = document.getElementById('child-select')

  var multiple = false

  var parentselectedvalues
  var childselectedvalues = []
  for (var i = 0; i < parentselect.options.length; i++) {
    var option = parentselect.options[i];
    if (option.selected) {
     contacts.find((e)=>{
      // console.log(e.contact_name,option.value);
       if(e.contact_name==option.value){
        parentselectedvalues={
          customer_name:e.contact_name,
          customer_id:e.contact_id
        }
       }
      })
    }
  }
  for (var i = 0; i < childselect.options.length; i++) {
    var option = childselect.options[i];
    if (option.selected) {
      // console.log(e.contact_name,option.value);
      // childselectedvalues.push(option.value)
      multiple = true
      contacts.filter((e)=>{
        if(e.contact_name===option.value){
         childselectedvalues.push({
           customer_name:e.contact_name,
           customer_id:e.contact_id
         })
        }
       })
    }
  }
  console.log(parentselectedvalues);
  console.log(childselectedvalues);

  var parent_child_select = {
    cf__ungzm_parent_child: parentselectedvalues,
    cf__ungzm_child_select: childselectedvalues

  }
  console.log(parent_child_select);
  if (multiple) {
    var custom = {
      url: 'https://www.zohoapis.com/books/v3/cm__ungzm_custom_module?organization_id=830021604',
      method: "POST",
      body: {
        mode: 'raw',
        raw: parent_child_select
      },
      connection_link_name: 'zohobookscontact'
    };
    console.log(custom);
    ZFAPPS.request(custom).then(function (value) {
      let responseJSON = JSON.parse(value.data.body);
      console.log('success', responseJSON);
    }).catch(function (err) {
      console.log('err', err);
    });
  }
  else {
    alert("Please select the child company")
  }
}


let parentselect = () => {
  var parentselect = document.getElementById('parent-select')
  selectparent=parentselect.value
  console.log(selectparent,contacts)
  opt(selectparent,contacts)
  
}

let opt=(selectparent,contacts) =>{
  var childselect = document.getElementById('child-select');
  childselect.innerHTML='<option value="" disabled>Choose your child company</option>'
  contacts.forEach(function (option) {
    // console.log(selectparent,option.contact_name);
    if(selectparent!=option.contact_name){
      // console.log('child recreate');
    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode(option.contact_name));
    opt.value = option.contact_name;
    childselect.appendChild(opt);
  }})
  M.FormSelect.init(childselect);
}


// custom module values get

let module_data_get=()=>{
  var custom = {
    url: 'https://www.zohoapis.com/books/v3/cm__ungzm_custom_module?organization_id=830021604',
    method: "GET",
    body: {
      mode: 'raw',
      raw:"RAW DATA"
    },
    connection_link_name: 'zohobookscontact'
  };
  console.log(custom);
  ZFAPPS.request(custom).then(function (value) {
    let responseJSON = JSON.parse(value.data.body);
    console.log('success', responseJSON.module_records);
   responseJSON.module_records.map((e)=>{
    console.log(e);
    get_custom_data.push({
      parent:e.cf__ungzm_parent_child,
      child:e.cf__ungzm_child_select
    })
   })

  }).catch(function (err) {
    console.log('err', err);
  });

}