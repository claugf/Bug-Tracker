
        $(document).ready(function(){
            //Function to toggle Show/Hide Department Table
            $("#btn_department").click(function(){
                $("#tb_department").fadeToggle("slow");
                //$(this).toggleClass("open");
                if ($(this).val() == "Show Departments") {
                    $(this).delay(800).val("Hide Departments");
                }
                else {
                    $(this).delay(800).val("Show Departments");
                }
            });

            //Function to live search employee
            $('#emp_number').keyup(function(){
                var txt = $(this).val();
                
                if (txt != '') {
                    $.ajax({
                        url:"dept_emp.php",
                        method:"post",
                        data:{search:txt,type:1},
                        dataType:"text",
                        success:function(data){
                            $('#tb_employee').html(data);
                        }
                    });
                }
                else{
                    $('#tb_employee').html('');
                    $.ajax({
                        url:"dept_emp.php",
                        method:"post",
                        data:{search:txt,type:1},
                        dataType:"text",
                        success:function(data){
                            $('#tb_employee').html(data);
                        }
                    });
                }
            });


            //Function to search an specific employee
            $('#btn_Search').click(function(){
                var txt = $('#emp_number').val();
                
                if (txt != '') {
                    $.ajax({
                        url:"dept_emp.php",
                        method:"post",
                        data:{search:txt,type:2},
                        dataType:"text",
                        success:function(data){
                            $('#tb_employee').html(data);
                        }
                    });
                }
                else{
                    $('#tb_employee').html('');
                    $.ajax({
                        url:"dept_emp.php",
                        method:"post",
                        data:{search:txt,type:2},
                        dataType:"text",
                        success:function(data){
                            $('#tb_employee').html(data);
                        }
                    });
                }
            });
        });