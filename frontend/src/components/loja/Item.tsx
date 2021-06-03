import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom"
import GetItemLoja from "../../api/getItemLoja";


const CarrouselButtons = (props:{numDots: number, indexCurentImage: number, updateDotBtn: (n: number)=>void}) => {
    const {numDots, indexCurentImage, updateDotBtn} = props;
    let dots = [];

    for(let i = 0; i < numDots; i++)
        dots.push(<div key={'dot'+i} id={'dot'+i} className={ i === indexCurentImage ? 'carrousel-dot ativo' : 'carrousel-dot'}></div>);

    return (
        <div className={'carrousel-dot-box'}>
            <div className={'left-arrow'} onClick={()=>updateDotBtn(-1)}><span></span></div>
            {dots.map(dot=>dot)}
            <div className={'right-arrow'} onClick={()=>updateDotBtn(1)}><span></span></div>
        </div>
    )
}


const Carrousel = (values: {imgs: string[]}) => {
    const {imgs} = {...values}
    const updateDot = () => {
        setIndexCurentImage((indexCurentImage+1)%carrouselImages.length);
        
    }
    const updateDotBtn = (n: number) => {
        var index = (indexCurentImage + n) < 0 ? carrouselImages.length-1 : (indexCurentImage+n)%carrouselImages.length;
        setIndexCurentImage(index);
    }

    const [carrouselImages, setCarrouselImages] = useState(imgs);
    const [indexCurentImage, setIndexCurentImage] = useState(0);
    const [timeoutCarrousel] = useState<ReturnType<typeof setTimeout>[]>([]);

    useEffect(()=>{
        setCarrouselImages(imgs);
    }, [imgs]);
    useEffect(()=>{
        timeoutCarrousel.map(t => clearTimeout(t));
        timeoutCarrousel.push(setTimeout(()=>updateDot(), 7000));
    }, [indexCurentImage, carrouselImages]);

    return (
        <div className={'carrousel-box'}>
            <div className={'carrousel-inner-box'} style={{width: 'calc( 100% *' + carrouselImages.length + ' )', transform: 'translateX(-' + 100/carrouselImages.length*indexCurentImage + '%)'}}>
                {Object.values(carrouselImages).map((image) =>
                    <img key={image as string} src={image as string} style={{width: 'calc( 100% /' + carrouselImages.length + ' )'}}/>
                )}
            </div>
            {carrouselImages.length > 0 ?
                <CarrouselButtons numDots={carrouselImages.length} indexCurentImage={indexCurentImage} updateDotBtn={updateDotBtn}/> : null
            }
        </div>
    );
}


const Item = () => {
    const {lojaitemId} = useParams<any>();
    const [item, setItem] = useState<any>();

    useEffect(()=>{
        GetItemLoja(lojaitemId)
        .then((resp:any)=>{
            setItem(resp);
            console.log(item)
        });
    },[])

    return (
        item ?
        <>
            <Carrousel imgs={item.imagensCarrossel}/>
            <br/>
            <div className={'item-loja-main-section-box'}>
                <div className={'item-loja-main-section-left'}>
                    <div className={'item-loja-main-section-left-title'}>{item.nome}</div>
                    <div className={'item-loja-main-section-left-subtitle'}>Produto <span>Coletivo Labor</span></div>
                    <div className={'item-loja-main-section-left-tags-minibox'}>
                        {Object.values(item.categorias).map((c:any) =>
                            <span className={'item-loja-main-section-left-tag'}><span className={'item-loja-main-section-left-tag-text'}>{c}</span></span>
                        )}
                    </div>
                    <div style={{textAlign: 'justify'}}>{item.descricao}</div>
                </div>
                <div className={'item-loja-main-section-right'}>
                    <div>
                        <div className={'item-loja-main-section-right-preco'}>R$ {item.preco.toFixed(2)}</div>
                        <div className={'item-loja-main-section-right-preco-parcela'}>ou em <span>10x {(item.preco/10).toFixed(2)}</span></div>
                        <span className={'item-loja-main-section-left-tag big'}><span className={'item-loja-main-section-left-tag-text'}>COMPRAR!</span></span>
                    </div>
                </div>
            </div>
            <div className={'item-loja-mosaico-box'}>
                <div className={'item-loja-mosaico-box-column one'}>
                    {item.imagensMosaico[0] ? <img className={'item-loja-mosaico-box-column-img'} src={item.imagensMosaico[0]}/> : null}
                </div>
                <div className={'item-loja-mosaico-box-column two'}>
                    {item.imagensMosaico[1] ? <img className={'item-loja-mosaico-box-column-img'} src={item.imagensMosaico[1]}/> : null}
                    {item.imagensMosaico[2] ? <img className={'item-loja-mosaico-box-column-img'} src={item.imagensMosaico[2]}/> : null}
                </div>
            </div>
            <div className={'item-loja-descricao-box'}>
                {<img src={item.imagemIcone}/>}
                {<div><span>Descrição<br/><br/></span>{item.descricaoTecnica}</div>}
            </div>
        </> : null
    )
}

export default Item;