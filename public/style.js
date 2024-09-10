const checkboxes = document.querySelectorAll('.checkbox')

checkboxes.forEach(i=>{
    i.addEventListener('click',()=>{
        if(i.checked){
            document.getElementById(`${i.id}Img`).style.backgroundColor = '#b076f5'
        }else{
            document.getElementById(`${i.id}Img`).style.backgroundColor = 'transparent'
        }
    })
})