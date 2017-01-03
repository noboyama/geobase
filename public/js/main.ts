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

		this.map = L.map( sElemntID );
		/* Add  Map layer  */
		L.tileLayer( this.sMapUrl  , {
			attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
		}).addTo(this.map);
		// 指定ファイルがあれば読み込む、なければAPI発行
		var url = "" ;
		if( this.sJsonFile == null  ) url =  "./api/get"  ;
		else url = this.sJsonFile ;
		this.loadLayer( url );
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
				var url = "./api/get"
				this.loadLayer( url );
			});
		return false;
	}
}

