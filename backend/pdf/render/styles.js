module.exports = `
*{
  box-sizing:border-box;
}

body{
  margin:0;
  padding:32px;
  background:#ececec;
  font-family:Arial,Helvetica,sans-serif;
}

img{
  max-width:100%;
}

.relative{position:relative;}
.absolute{position:absolute;}

.mx-auto{margin-left:auto;margin-right:auto;}

.w-full{width:100%;}
.bg-white{background:#fff;}

.text-white{color:#fff;}
.text-right{text-align:right;}

.font-bold{font-weight:700;}
.font-black{font-weight:900;}
.font-medium{font-weight:500;}

.rounded-2xl{border-radius:16px;}
.rounded-3xl{border-radius:24px;}
.rounded-xl{border-radius:12px;}

.overflow-hidden{overflow:hidden;}

.border{
  border:1px solid #e5e7eb;
}

.border-zinc-100{
  border-color:#f1f5f9;
}

.border-zinc-200{
  border-color:#e5e7eb;
}

.p-8{padding:32px;}
.p-5{padding:20px;}

.mt-8{margin-top:32px;}
.mt-10{margin-top:40px;}
.mt-14{margin-top:56px;}
.mb-6{margin-bottom:24px;}

.h-3{height:12px;}
.h-20{height:80px;}

.object-contain{
  object-fit:contain;
}

.flex{
  display:flex;
}

.items-start{
  align-items:flex-start;
}

.items-end{
  align-items:flex-end;
}

.justify-between{
  justify-content:space-between;
}

.justify-end{
  justify-content:flex-end;
}

.flex-col{
  flex-direction:column;
}

.grid{
  display:grid;
}

.shadow-sm{
  box-shadow:0 2px 8px rgba(0,0,0,.08);
}

.shadow-xl{
  box-shadow:0 15px 40px rgba(0,0,0,.18);
}

.text-sm{font-size:14px;}
.text-xs{font-size:12px;}
.text-xl{font-size:22px;}
.text-2xl{font-size:30px;}
.text-3xl{font-size:38px;}

`;
