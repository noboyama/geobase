/// <reference path="./../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="./../../node_modules/@types/jqueryui/index.d.ts" />
/// <reference path="./../../node_modules/@types/leaflet/index.d.ts" />

var g_Map = null ;
var g_Geojson = null ;


class GeoData2 {
	private layerData : any[] ;
	private propertyDiv : any  ;
	 // コンストラクター
    constructor(  )
    {
		this.layerData = new Array() ;
	}
	public setLeyer( feature : any , layer : any )
	{
		var id = this.layerData.length  ;
		this.layerData.push( { id : id ,  feature:feature , layer : layer  })
	}
	private viewPopup( elm : any )
	{
		var feature =elm[ "feature" ]  ;
		var layer =elm[ "layer" ]  ;
		try{
			var popup = layer.getPopup() ;
			popup.openPopup( );
		}
		catch (Exception ){
			popup = layer.bindPopup( feature.properties.name ,  {maxWidth: 500, closeOnClick: false}  );
			popup.openPopup( );
		}
	}
	public renderProperty( elm : any   )
	{
		$(this.propertyDiv ).empty() ;
		var feature =elm[ "feature" ]  ;
		if(  feature != null )
		{
			for( var key in feature.properties )
			{
				$( "<div class='line' >"
				      + "<div class='name' >" + key +"</div>"
				      + "<div class='value'>" + feature.properties[key] + "</div>"
				 +"</div>" )
					.appendTo( this.propertyDiv );
			}
		}
	}
	public find( leaflet_id : Number ){
		var ret = null ;
		this.layerData.forEach( ( elm , idx  ) => {
			if( elm["id"] == leaflet_id )
			{
				ret = elm ;
				return ;
			}
		});
		return ret ;
	}
	public renderList( xList : any , xProperty: any)
	{
		var _self = this ;
		_self.propertyDiv = xProperty ;
		$( xList ).addClass("geodata_list");
		this.layerData.forEach( ( elm , idx  ) => {
				var id = elm[ "id" ]  ;
				var feature =elm[ "feature" ]  ;
				$( "<div item_id='"+id +"' class='selectee line' >" + feature.properties.name + "</div>" )
					.appendTo( xList );
		})
		$( xList ).selectable({ "selected" : function( e, ui )
			{
				//$("#WayList .selected").removeClass("selected") ;
				var temp = $(ui.selected);
				var id = $(temp[ 0 ]).attr( "item_id") ;
				var item = _self.find( Number(id) )
				if( item != null )
				{
					_self.viewPopup( item )
					_self.renderProperty( item )
				}
			}
		});
	}


}

class GeoData {
	// 現在のGeoDataでは階層が深いと解析しきれない
	private jsonData: { key? : any ;} = {};

	private propertyDiv : any  ;
	 // コンストラクター
    constructor( jsondata : any[]  )
    {
		jsondata.forEach( item => {
			this.jsonData[ item._id ] = item  ;
		});
	}
	public setLeyer( id : string , layer : any )
	{
		var _self = this  ;
		var item = this.jsonData[ id  ]  ;
		item[ "layer" ] = layer ;
		layer.on( "click" , e =>{
			_self.viewPopup( id  );
			_self.renderProperty( id ) ;
			_self.seleced( id ) ;
			return true ;
		})
	}
	public getInfo( id : string ) : any
	{
		return this.jsonData[ id  ]  ;
	}
	private viewPopup(id)
	{
		var _self = this;

		var temp = _self.jsonData[id]
		var sStr = _self.htmlPopup(id);
		var layer = temp["layer"];
		var popup = layer.getPopup() ;
		if( null !=  popup  )
		{
			layer.unbindPopup() ;
		}
		try{
			popup = layer.bindPopup(sStr+id,  {maxWidth: 500, closeOnClick: false}  );
			popup.openPopup( );
		}
		catch (Exception ){
			console.log( "popup error !!" + Exception.toString() )
		}
	}
	public renderList( xList : any , xProperty: any)
	{
		var _self = this ;
		_self.propertyDiv = xProperty ;
		$( xList ).addClass("geodata_list")
		for( var id in this.jsonData ){
			var feature = this.jsonData[ id ]  ;
			$( "<div id="+id +" class='selectee' >" + feature.properties.name + "</div>" )
				/* .bind( "click" ,  function(){
					//$("#WayList .selected").removeClass("selected") ;
					var id = $(this).attr( "id") ;
					_self.viewPopup( id  );
					_self.renderProperty( id ) ;
				} )
				*/
				.appendTo( xList );
		}
		$( "#WayList" ).selectable({ "selected" : function( e, ui )
			{
				//$("#WayList .selected").removeClass("selected") ;
				var temp = $(ui.selected);
				var id = $(temp[ 0 ]).attr( "id") ;
				_self.viewPopup( id  );
				_self.renderProperty( id ) ;
			}
		});
	}
	public SelectSelectableElements (selectableContainer :any , elementsToSelect:any )
	{
		$(".ui-selected", selectableContainer).not(elementsToSelect).removeClass("ui-selected").addClass("ui-unselecting");
		$(elementsToSelect).not(".ui-selected").addClass("ui-selecting");
		try {
			selectableContainer.data("ui-selectable")._mouseStop(null);
		}
		catch( e )
		{
			$(elementsToSelect).click() ;
		}
	}
	public seleced( id : string )
	{
		//$("#WayList .ui-seleced").removeClass( "ui-seleced") ;
		//$("#"+id).trigger('click');
		this.SelectSelectableElements($("#WayList" ), $("#"+id ) ) ;

		//$("#WayList .ui-seleced").removeClass( "ui-seleced") ;
		//$("#WayList .ui-selectee").removeClass( "ui-selectee" ) ;
		//$("#WayPoint_" + id ).addClass( "ui-seleced" ) ;

	}
	public htmlPopup( id : string )  : string
	{
		var html  = "" ;

		var feature = this.jsonData[ id ]  ;
		if(  feature != null )
		{
			html = "<div id='popup_"+feature._id +"'>" + feature.properties.name + "</div>";
		}
		return html ;
	}
	private geneFormGroup(  label : string , obj : any  ) : any
	{
		$(obj).addClass( "col-sm-8" ) ;
		var ret = $("<div class='form-group'></div>") ;
		$(ret).append( $('<label class="col-sm-3 control-label">'+label+'</label>') )
		$(ret).append( $(obj) ) ;
		return ret ;
	}
	public update_proparty( id )
	{
		var _self = this  ;
		this.propertyDiv ;
		var teml : any = $(this.propertyDiv ).get(0) ;
		var fd = new FormData( teml );　
		$.ajax({
				url: "/api/update?object_id=" + id  ,
				type: "POST",
				data: fd,
				processData: false,
				contentType: false,
				dataType: 'json'
			})
			.done((data)=> {
				console.log("更新");
				var oid = data[ "_id" ]  ;
				_self.jsonData[oid  ].info = data["info"] ;
			});
	}
	public renderProperty( id : string  )
	{
		var _self = this ;
		$(this.propertyDiv ).empty() ;
		var feature = this.jsonData[ id ]  ;
		if(  feature != null )
		{
			var sCategory= feature.info[ "category" ] ;
			var xcategory= $("<select name='category'></select>")
				.append('<option value="酒蔵">酒蔵</option>')
				.append('<option value="ルート">ルート</option>')
				.append('<option value="酒蔵">酒蔵</option>')
				.append('<option value="グルメ">グルメ</option>')
				.append('<option value="湧き水">湧き水</option>')
			$(xcategory).val(  sCategory );
			var sName = feature.properties.name ;
			var sDate= feature.info[ "date" ] ;
			var sAddr= feature.properties[ "desc" ]   != null ?  feature.properties[ "desc" ]   : "" ;
			var sCity= feature.info[ "city" ]  != null ?  feature.info[ "city" ]   : "" ;
			var sWorkday= feature.info[ "workday" ] !=null ?   feature.info[ "workday" ] : ""  ;
			var sTag= feature.info[ "tag" ] != null ? feature.info[ "tag" ] : "" ;
			var sInfo= feature.info[ "tag" ] != null ? feature.info[ "info" ] : "" ;
			var name = this.geneFormGroup(  "名前" ,$('<input type="text" name="name" value="'+sName+'">'));
			var addr= this.geneFormGroup(  "住所" ,$('<input type="text"  name="desc" value="'+sAddr+'">'));
			var category = this.geneFormGroup(  "カテゴリ" ,xcategory );
			var date = this.geneFormGroup(  "登録日" ,$('<input type="text" name="date" value="'+sDate+'">'));
			var city = this.geneFormGroup(  "所在地" ,$('<input type="text" name="city" value="'+sCity+'">'));
			var workday = this.geneFormGroup(  "営業日" ,$('<input type="text" name="workday" value="'+sWorkday+'">'));
			var tag = this.geneFormGroup(  "タグ" ,$('<input type="text" name="tag" value="'+sTag+'">'));
			var info = this.geneFormGroup(  "備考" ,$('<input type="textarea" name="info" rows=5 value="'+sInfo+'">'));
			$(this.propertyDiv ).append( name ) ;
			$(this.propertyDiv ).append( addr ) ;
			$(this.propertyDiv ).append( date ) ;
			$(this.propertyDiv ).append( category ) ;
			$(this.propertyDiv ).append( city ) ;
			$(this.propertyDiv ).append( $("<hr>") ) ;
			$(this.propertyDiv ).append( workday ) ;
			$(this.propertyDiv ).append( tag ) ;
			$(this.propertyDiv ).append( info ) ;
			$(this.propertyDiv ).append( $("<hr>") ) ;
			$("#Property input").change( function( e ){
				var name  = $(this).attr( "name" );
				var val = $(this).val();
				console.log( name+ ":" + val  )
				_self.update_proparty( id ) ;
			}) ;
		}
	}
}

class LeafLetMap {
	private map : any ;
	private geojson : any ;
	private geoData : GeoData2 ;

	private  sMapUrl : string ;

	private sJsonFile : string = null ;

    // コンストラクター
    constructor( sElemntID : string , sfile : string = null )
    {
		this.sMapUrl = 'http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png' ;
		this.sJsonFile = sfile ;
		this.initLeaflet( sElemntID ) ;
    }
	public initLeaflet( sElemntID  : string )
	{
		/*　popupを閉じなくする 、全部閉じなくなるので工夫が必要
		L.Map = L.Map.extend({
			openPopup: function (popup) {
				//        this.closePopup();  // just comment this
				this._popup = popup;

				return this.addLayer(popup).fire('popupopen', {
					popup: this._popup
				});
			}
		});
		*/


		this.map = L.map( sElemntID );
		/* Add  Map layer  */
		L.tileLayer( this.sMapUrl  , {
			attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
		}).addTo(this.map);
		// 指定ファイルがあれば読み込む、なければAPI発行
		var url = "" ;
		if( this.sJsonFile == null  ) url =  "./api/get"  ;
		else url = this.sJsonFile ;
		//var url = "/gpx/Current.gpx.geojson";
		this.loadLayer( url );
		//var url = "/gpx/Current.gpx.geojson";
		//this.loadLayer( url );
		this.map.setView([35.3622222, 138.7313889], 10);

		$('#gpx_file').change(function() {
			var file = $(this).prop('files')[0];
			var pattern = /(.+)(\.[^.]+$)/;
			//「image-test」と表示されます
			var name  = file.name.match(pattern)[1] ;
			$('#gpx_name').val( name );
		});
	}
	public loadLayer ( url : string )  {
		if( this.map == null )  return ;

		$.getJSON(url, (data)=> {
			if( data == null || data.length == 0 )
			{
				 this.geojson  = null ;
				alert( "データが登録されていません" ) ;
				return ;
			}
			var html = "" ;
			this.geoData =new GeoData2( )  ;
			this.geojson = L.geoJson( data, {
				color: "#000000",
				opacity: 0.7,
				// ポイント描画時にコールされるICONを変える場合はここで変更可能
				/*
				pointToLayer: function (feature, latlng) {
					return new L.CircleMarker(latlng, {
						radius: 10,
						fillOpacity: 0.85,
						color:"#ff0000"
					});
				},
				*/
				onEachFeature:  (feature, layer) =>{
					if( this.geoData != null )
					{
						this.geoData.setLeyer( feature , layer ) ;
					}
				},

			});
			this.map.fitBounds( this.geojson.getBounds());
			this.geojson.addTo(this.map);
			this.geoData.renderList( $("#WayList") , $("#Property") );
		});
	}
	public  gpxUpload( ) {
		if( this.map == null )  return ;
		var name = $("#gpx_name").val() ;
		if(  this.geojson  != null ){
			this.map.removeLayer( this.geojson ) ;
		}
		 $("#WayList").empty() ;
		 $("#Property").empty() ;
		 this.geoData = null ;
		 var telm : any = $('#gpx_upload').get(0) ;
		var fd = new FormData( telm );　
		$.ajax({
				url: "/post/gpxfileupload?name=" + name ,
				type: "POST",
				data: fd,
				processData: false,
				contentType: false,
				dataType: 'json'
			})
			.done((data)=> {
				//var url = "/gpx/Current.gpx.geojson";
				var url = "./api/get"
				this.loadLayer( url );
			});
		/*
		this.weyPointList.clear() ;
		this.weyPointList = null ;
		this.weyPointList = new WeyPointList(g_Map);
		var fd = new FormData($('#gpx_upload').get(0));　
		$.ajax({
				url: "/post/gpxfileupload?name=" + name ,
				type: "POST",
				data: fd,
				processData: false,
				contentType: false,
				dataType: 'json'
			})
			.done((data)=> {
				//var url = "/gpx/Current.gpx.geojson";
				var url = "./api/get"
				this.loadLayer( url );
				this.map.setView([35.3622222, 138.7313889], 10);
				// Mainクラスのインスタンスを作る
				this.weyPointList = new WeyPointList(this.map);
			});
			*/
		return false;
	}
	public resize()
	{
		// うまくいかない
		//this.map.setView([35.3622222, 138.7313889], 10);
	}

}

