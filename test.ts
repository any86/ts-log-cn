function nOrs(){
    return Math.random()>0.5? 123:'abc';
}
let input = nOrs();
if(typeof input === 'number'){
    input++;
}