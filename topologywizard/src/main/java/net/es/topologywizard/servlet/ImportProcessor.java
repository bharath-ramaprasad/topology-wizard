/**
 * 
 */
package net.es.topologywizard.servlet;

/**
 * @author Bharath
 *
 */

import org.apache.xerces.parsers.*;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import java.lang.*;
import java.net.MalformedURLException;
import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;
import java.util.zip.*;

import javax.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;


import net.sf.json.xml.XMLSerializer;

import org.apache.geronimo.mail.util.QuotedPrintable;
import org.apache.xerces.impl.dv.dtd.NMTOKENDatatypeValidator;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;


import net.sf.json.*;
import org.json.JSONObject;
import org.json.JSONArray;



import org.w3c.dom.*;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.uwyn.jhighlight.renderer.XhtmlRendererFactory;

import net.es.topologywizard.format.nmwg.urnparser.*;




public class ImportProcessor extends HttpServlet {
	
	
	Random rand_gen = new Random();
	
	private final String PROP_FILE="config/connectivity.properties";
	
	private String server;
	
	private String uname;
	
	private String passwd;
	
	public void doGet(HttpServletRequest req, HttpServletResponse res)
	throws ServletException,IOException
	{
		
	}
	
	public void readConfigProperties()
	{
		   try {  
    		   InputStream is = new FileInputStream(new File(PROP_FILE));

    		   Properties prop = new Properties();  
    		   prop.load(is);  
    		   this.server = prop.getProperty("server");  
    		   this.uname = prop.getProperty("uname");  
    		   this.passwd = prop.getProperty("passwd");  
               is.close();  
               
               
           } catch (Exception e) {  
        	   System.out.println("Failed to read from " + PROP_FILE + " file.");  
               e.printStackTrace();  
           }  

	}

	
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	throws ServletException,IOException
	{
		
		res.setContentType("text/javascript");
		
		PrintWriter out = res.getWriter();
		
		String topologyWirings = null;
		
		 this.readConfigProperties();    
	       
	    						
		InputStream is= req.getInputStream();
		Reader in = new InputStreamReader(is, "UTF-8");
		final char[] buffer = new char[0x10000];
		StringBuilder filebuffer = new StringBuilder();
		int read;
		do {
			read = in.read(buffer, 0, buffer.length);
			if (read >0 ) {
				filebuffer.append(buffer, 0, read);
			}
			} while (read >= 0);
		
		StringBuilder sb = new StringBuilder(filebuffer);
		
		String filename_start_pattern = "filename=";

		int fn_pattern_strtindex =  sb.indexOf(filename_start_pattern);
		
		String startofFilename = "\"";
		
		int fn_pattern_endindex = sb.indexOf(startofFilename, fn_pattern_strtindex);
			
		int fileNameEOL = sb.indexOf(startofFilename, fn_pattern_endindex + 1);
		
		String topoFileName = sb.substring(fn_pattern_endindex + 1,fileNameEOL);
		
		
		String[] partsOfFileName = topoFileName.split(".nmwg");
		
		String topologyID = partsOfFileName[0];
		
		//try to get the wirings from the db if available otherwise create the wirings
		
		// net.sf.json.JSONArray topologyDetails = this.getTopologyDetails(topologyID);
			
		String topologyDetails = this.getTopologyDetails(topologyID);
		
		if(topologyDetails == null)
		{
			System.out.println("No such topology found in the database..Creating the topology visualization for the topology description file imported");
			
			//get the file contents which describes the topology
			
			filename_start_pattern = "<?xml";
			
			int file_pattern_strtindex =  sb.indexOf(filename_start_pattern);
			
			String end_of_descr_pattern = "------------";
			
			int end_of_descr_index  = sb.indexOf(end_of_descr_pattern,file_pattern_strtindex);
			
			String fileConents = sb.substring(file_pattern_strtindex ,end_of_descr_index -1);
			
			fileConents = fileConents.trim();
			
			
			
			try
			{
		           TransformerFactory transfac = TransformerFactory.newInstance();
		            Transformer trans = transfac.newTransformer();
		            trans.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
		            trans.setOutputProperty(OutputKeys.INDENT, "yes");

		            Document parse_doc = null;

		            
		           // DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		           // DocumentBuilder builder = factory.newDocumentBuilder();
		            InputSource input_src = new InputSource(new StringReader(fileConents));
		           // parse_doc =  builder.parse(input_src);
		            
		           
		            
		            DOMParser parser = new DOMParser();
		            
		            parser.parse(input_src);
		            
		            parse_doc = parser.getDocument( );

		                       
		            int interdomain_node_counter = 0;
		      
		            
		            try
		            {
		                
		                NodeList  parsed_topology_elems = parse_doc.getElementsByTagName("CtrlPlane:topology");
		                
		                
		                
		                if(parsed_topology_elems == null)
		                {
		                	System.err.println("Topology format incorrect. Please check that the topology schema is NMWG-CP");
			            	out.write("null");	
		                }
		                else
		                {
		                	
		                	
		                	JSONObject topology_json = null; 
		                	
		                	//modules array
		                	net.sf.json.JSONArray modulesArray = null;
		                	
		                	//wires array
		                	net.sf.json.JSONArray wiresArray = null;
		                	
		                	//the properties JSON
		                	JSONObject property_json = null;	
		                	
		                	
		                	JSONObject prop_topo_id = null;
		                	JSONObject prop_idcid = null;
		                	JSONObject prop_description = null;
		                	JSONObject prop_mlt = null;
		                	JSONObject prop_topoformat = null;
		                	JSONObject prop_category = null;	

		                	Element  p_topo_element = null;
		                	
	    	                for (int topo_iter = 0; topo_iter < parsed_topology_elems.getLength(); topo_iter++) 
	    	                {
	    	                   p_topo_element = (Element)parsed_topology_elems.item(topo_iter);
	    	                    
	    	                    String topology_name = p_topo_element.getAttribute("id");
	    	                    
	    	                  
	    	                    modulesArray = new net.sf.json.JSONArray();
	    	                    wiresArray = new net.sf.json.JSONArray();
	    	                    
	    	                    
	    	                    //now get the idc id
	    	                    
	    	                    NodeList  p_topo_idcid_elems = p_topo_element.getElementsByTagName("CtrlPlane:idcId");
	    	                    
	    	                    if(p_topo_idcid_elems == null)
	    	                    {
	    	                    	System.err.println("idc not specified");
	    	                    }
	    	                    else
	    	                    {
	    	                    	int idc_length = p_topo_idcid_elems.getLength();
	    	                    	
		    	                    for(int idcitr = 0; idcitr < idc_length ; idcitr++)
		    	                    {
		    	                    	Element idc_element	= (Element)p_topo_idcid_elems.item(idcitr);
		    	                    	
		    	                    	String idcid = idc_element.getTextContent();
		    	                    	
		    	                    	prop_idcid = new JSONObject().put("idcId",idcid);
		    	                    
		    	                    	
		    	                    }
	
	    	                    }
	    	                    
	    	                   
	    	                    property_json = new JSONObject();
	    	                    property_json.put("category", "ExperimentalTopology");
	    	                   
	    	                   // prop_description = new JSONObject()
	    	                    property_json.put("description", "Describe this topology");
	    	             
	    	                   // prop_mlt = new JSONObject().
	    	                    property_json.put("mlt", false);
	    	                    
	    	                    property_json.put("name","");
	    	                    
	    	                    //property_json.put("name",topology_name);
	    	                    
	    	                    //prop_topoformat = new JSONObject();
	    	                    property_json.put("topoformat", "NMWG Format");
	    	                                       
	    	                    
	    	                    
	    	                  //  propertiesArray.add(prop_idcid.toString()); use it for modulearray and wire array later on
	    	                   
	    	                    NodeList  parsed_domain_elems = p_topo_element.getElementsByTagName("CtrlPlane:domain");
	    		                
	    		               
	    		                if(parsed_domain_elems == null)
	    		                {
	    		                	System.err.println("Topology format incorrect. Please check that the topology schema is NMWG-CP");
	    			            	out.write("null");	
	    		                }
	    		                else
	    		                {
	    		                
			    	                int p_domainCount = parsed_domain_elems.getLength();
			    	                
			    	                for (int domain_iter = 0; domain_iter < p_domainCount; domain_iter++) 
			    	                {
			    	                    Element  p_domain_element = (Element)parsed_domain_elems.item(domain_iter);
			    	                    
			    	                   
			    	                    
			    	                    String p_domain_id = p_domain_element.getAttribute("id"); 
			    	                    
			    	                    
			    	                    
			    	                    NodeList  parsed_node_elems = p_domain_element.getElementsByTagName("CtrlPlane:node");
			    		                
				    		               
			    		                if(parsed_node_elems == null)
			    		                {
			    		                	System.err.println("Topology format incorrect. Please check that the topology schema is NMWG-CP");
			    			            	out.write("null");	
			    		                }
			    		                else
			    		                {
			    		                
					    	                int p_nodeCount = parsed_node_elems.getLength();
					    	                
					    	                for (int node_iter = 0; node_iter < p_nodeCount; node_iter++,interdomain_node_counter++) 
					    	                {
					    	                    Element  p_node_element = (Element)parsed_node_elems.item(node_iter);
					    	                    
					    	                    String p_node_id = p_node_element.getAttribute("id");
					    	                    
					    	                   
					    	                    
					    	                    //get the node id from path utils.
					    	                    
					    	                    
					    	                    String node_id = URNParser.extractID(p_node_id, URNParser.NODE_TYPE);
					    	                    
					    	                    
					    	                    /*
					    	                     --done--
					    	                    "config":{"position":[608,397],"xtype":"WireIt.ImageContainer"},
					    	                    "id":4,
					    	                    "name":"Server",
												*/
					    	                    
					    	                    //default module properties first
					    	                    
					    	                   //String coord =  "[" + getRandomCoord(1280) + "," + getRandomCoord(800) + "]";
					    	                   
					    	                   
					    	                   
					    	                   int[] coord = {getRandomCoord(1280), getRandomCoord(800)};
					    	                   
					    	                   
					    	                   JSONObject module_json = new JSONObject();
					    	                 
					    	                   JSONObject mod_config = new JSONObject();
					    	                   
					    	                   mod_config.put("position", coord);
					    	                   mod_config.put("xtype", "WireIt.ImageContainer");
					    	                   
					    	                   module_json.put("config",mod_config);
					    	                   
					    	                   module_json.put("id", interdomain_node_counter);
					    	                   
					    	                   
					    	                   
					    	                   module_json.put("name", "Server");
					    	                   
					    	                  
					    	                   
					    	                    NodeList  parsed_address_elems = p_node_element.getElementsByTagName("CtrlPlane:address");
					    		                
						    		               
					    		                if(parsed_address_elems == null)
					    		                {
					    		                	System.err.println("Topology format incorrect. Please check that the topology schema is NMWG-CP");
					    			            	out.write("null");	
					    		                }
					    		                else
					    		                {
					    		                
					    		                		String node_address = null;
							    	                    for(int addr_itr = 0;addr_itr < parsed_address_elems.getLength();addr_itr++)
							    	                    {
						    	                    		Element p_node_addr_element = (Element)parsed_address_elems.item(addr_itr);
						    	                    		node_address = p_node_addr_element.getTextContent();
						    	                    			
							    	                    }
								    	                    
							    	                    JSONObject node_value_json = new JSONObject();
							    	                    
							    	                    node_value_json.put("domainid",p_domain_id);
							    	                    
							    	                    node_value_json.put("nodeaddress", node_address);
							    	                    
							    	                    node_value_json.put("nodeid", node_id);
							    	                    
							    	                   
							    	                    
							    	                    net.sf.json.JSONArray portInfo_array = new net.sf.json.JSONArray();
							    	                    
							    	                    //populate portInfo_array here
							    	                    
							    	                    JSONObject portinfo_json = new JSONObject();
							    	                    
							    	                    NodeList  port_elems = p_node_element.getElementsByTagName("CtrlPlane:port"); 
							    	                    
							    	                   
							    		                if(port_elems == null) 
							    		                {
							    		                	System.err.println("Topology format incorrect. Please check that the topology schema is NMWG-CP");
							    			            	out.write("null");	
							    		                }
							    		                else
							    		                {
							    		                		
									    	                    for(int port_itr = 0;port_itr < port_elems.getLength();port_itr++)
									    	                    {
								    	                    		Element port_element = (Element)port_elems.item(port_itr);
								    	                    		
								    	                    		String port_id = URNParser.extractID(port_element.getAttribute("id"), URNParser.PORT_TYPE); 

								    	                    		String port_capacity = port_element.getElementsByTagName("CtrlPlane:capacity").item(0).getTextContent();
								    	                    		
								    	                    		String port_max_res_capacity = port_element.getElementsByTagName("CtrlPlane:maximumReservableCapacity").item(0).getTextContent();
								    	                    		
								    	                    		String port_min_res_capacity = port_element.getElementsByTagName("CtrlPlane:minimumReservableCapacity").item(0).getTextContent();
								    	                    		
								    	                    		String port_granularity = port_element.getElementsByTagName("CtrlPlane:granularity").item(0).getTextContent();
								    	                    		
								    	                    		
								    	                    		portinfo_json.put("Capacity",port_capacity);	
								    	                    		portinfo_json.put("granularity",port_granularity);
								    	                    		portinfo_json.put("maxResCapacity",port_max_res_capacity);
								    	                    		portinfo_json.put("minResCapacity",port_min_res_capacity);
								    	                    		portinfo_json.put("portID",port_id);
								    	                    		portinfo_json.put("portName",port_id);
								    	                    		
								    	                    		
								    	                    		
								    	                    		portInfo_array.add(portinfo_json.toString());
								    	                    		
								    	                    		//now get the links and from the wires
								    	                    		
								    	                    		
								    	                    		NodeList link_elems	 = port_element.getElementsByTagName("CtrlPlane:link");
								    	                    		
										    		                if(link_elems == null)
										    		                {
										    		                	continue;	
										    		                }
										    		                else
										    		                {
										    		                		
												    	                    for(int link_itr = 0;link_itr < link_elems.getLength();link_itr++)
												    	                    {
												    	                    		JSONObject linkprops_json = new JSONObject();
												    	                    	
												    	                    		Element link_ele = (Element) link_elems.item(link_itr);
												    	                    		
												    	                    		String link_id = URNParser.extractID(link_ele.getAttribute("id"), URNParser.LINK_TYPE);													    	                    		
												    	                    		
												    	                    		String remoteLink_full_urn = link_ele.getElementsByTagName("CtrlPlane:remoteLinkId").item(0).getTextContent();
												    	                    		
												    	                    		String remotelink_id = URNParser.extractID(remoteLink_full_urn,URNParser.LINK_TYPE);
												    	                    		
												    	                    		String tem = link_ele.getElementsByTagName("CtrlPlane:trafficEngineeringMetric").item(0).getTextContent();
												    	                    		
												    	                    		NodeList switchCapability = link_ele.getElementsByTagName("CtrlPlane:SwitchingCapabilityDescriptors");
												    	                    		
												    	                    		Element switch_capab_descr_ele = (Element)switchCapability.item(0);
												    	                    		
												    	                    		String switchingcapType	 = switch_capab_descr_ele.getElementsByTagName("CtrlPlane:switchingcapType").item(0).getTextContent();
												    	             
												    	                    		String encodingType	 = switch_capab_descr_ele.getElementsByTagName("CtrlPlane:encodingType").item(0).getTextContent();
												    	                    		
												    	                 											    	                    		
												    	                    		Element switchingCapab_ele = (Element) switch_capab_descr_ele.getElementsByTagName("CtrlPlane:switchingCapabilitySpecificInfo").item(0);
												    	                    		
												    	                    		String 	switch_capability	 = switchingCapab_ele.getElementsByTagName("CtrlPlane:capability").item(0).getTextContent();
												    	                    		
												    	                    		String 	interfaceMTU	 = switchingCapab_ele.getElementsByTagName("CtrlPlane:interfaceMTU").item(0).getTextContent();
												    	                    		
												    	                    		String 	vlanRangeAvailability	 = switchingCapab_ele.getElementsByTagName("CtrlPlane:vlanRangeAvailability").item(0).getTextContent();
												    	                    		
												    	                    		
												    	                    		linkprops_json.put("capability", switch_capability);
												    	                    		
												    	                    		linkprops_json.put("interfaceMTU", interfaceMTU);
												    	                    		
												    	                    		linkprops_json.put("vlanRangeAvailability", vlanRangeAvailability);
												    	                    		
												    	                    		linkprops_json.put("linkid", link_id);
												    	                    		
												    	                    		linkprops_json.put("remoteLinkId", remotelink_id);
												    	                    		
												    	                    		linkprops_json.put("trafficEngineeringMetric", tem);
												    	                    		
												    	                    		linkprops_json.put("switchingcapType", switchingcapType);
												    	                    		
												    	                    		linkprops_json.put("encodingType", encodingType);
												    	                    		
												    	                    		
												    	                    		
												    	                    		JSONObject source_link_json = new JSONObject();
												    	                    		
												    	                    		JSONObject dest_link_json = new JSONObject();
												    	                    		
												    	                    		source_link_json.put("moduleId",interdomain_node_counter);
												    	                    		
												    	                    		source_link_json.put("terminal", port_id);
												    	                    		
												    	                    		String remote_domain_id = URNParser.extractID(remoteLink_full_urn,URNParser.DOMAIN_TYPE);
												    	                    		
												    	                    		String remote_node_id = URNParser.extractID(remoteLink_full_urn,URNParser.NODE_TYPE);
												    	                    			
												    	                    		String remote_port_id = URNParser.extractID(remoteLink_full_urn,URNParser.PORT_TYPE);	
												    	                    		
												    	                    		int peek_global_node_counter = 0;
												    	                    		
												    	                    		boolean peek_successfull = false;
												    	                            for (int peek_domain_iter = 0; peek_domain_iter < p_domainCount; peek_domain_iter++) 
															    	                {
															    	                    Element  peek_domain_element = (Element)parsed_domain_elems.item(peek_domain_iter);
															    	                 	
															    	                    String peek_domain_id = URNParser.extractID(peek_domain_element.getAttribute("id"), URNParser.DOMAIN_TYPE);
															    	                    
															    	                    NodeList peek_node_elems = peek_domain_element.getElementsByTagName("CtrlPlane:node");
												    	                    		//first find out the remote nodes position in the list of nodes to find out the module id
												    	                    		
												    	                    			for (int peek_node_iter = 0; peek_node_iter < peek_node_elems.getLength(); peek_node_iter++) 
																    	                {
												    	                    				
												    	                    				Element  peek_node_element = (Element)peek_node_elems.item(peek_node_iter);
																    	                    
																    	                    String peek_node_id = URNParser.extractID(peek_node_element.getAttribute("id"), URNParser.NODE_TYPE);
																    	                    	
																    	                    if(peek_domain_id.equals(remote_domain_id) && peek_node_id.equals(remote_node_id))
																    	                    {
																    	                    	dest_link_json.put("moduleId", peek_global_node_counter);
																    	                    	
																    	                    	dest_link_json.put("terminal", remote_port_id);
																    	                    	
																    	                    	peek_successfull = true;
																    	                    	break;
																    	                    	
																    	                    }
																    	                    
																    	                    peek_global_node_counter++;
																    	                }
												    	                    			if(peek_successfull)
												    	                    					break;
															    	                }
												    	                    		
												    	                    		//now construct the complete wire json
												    	                            
												    	                            JSONObject LinkJSON = new JSONObject();
												    	                            
												    	                            LinkJSON.put("linkProps",linkprops_json);
												    	                            
												    	                            LinkJSON.put("src",source_link_json);
												    	                            
												    	                            LinkJSON.put("tgt",dest_link_json);
												    	                            
												    	                            
												    	                            
												    	                            wiresArray.add(LinkJSON.toString());
												    	                            

												    	                    }
										    		                }
								    	                    		
								    	                    		
									    	                    }
							    		                }
							    	                   
							    	                    
							    	                    
							    	                    node_value_json.put("portInfo",portInfo_array);
							    	                    
							    	                    module_json.put("value",node_value_json);
							    	                    
							    	                    
							    	                    
							    	                    modulesArray.add(module_json.toString());
							    	                         
							    	                    
					    		                }
					    	                    
					    	                }
			    		                }


			    	                   		
			    	                   
			    	                    
			    	                }

	    		                	
	    		                }
	    	                    
	    	                    
	    	                    
	    	                    
	    	                    
	    	                }
	    	                
	    	                

		                	
	    	                
	    	                
	    	                
		                 /*   NodeList parsed_domains_elems = p_topo_element.getElementsByTagName("CtrlPlane:domain");
		                    
		                    
		                    
		    	            if (parsed_domains_elems == null) {
		    	            	
		    	            	System.err.println("atleast one domain expected in a topology. please specify the domain details");
		    	            	out.write("null");
		    	            }
		    	            
		    	            else
		    	            {
		    	                int p_domainCount = parsed_domains_elems.getLength();
		    	                
		    	                for (int domain_iter = 0; domain_iter < p_domainCount; domain_iter++) 
		    	                {
		    	                    Element  p_domain_element = (Element)parsed_domains_elems.item(domain_iter);
		    	                }


		    	            }*/

	    	                topology_json = new JSONObject();
	    	                
	    	                topology_json.put("modules", modulesArray);
	    	                topology_json.put("properties", property_json);
	    	                topology_json.put("wires", wiresArray);
	    	                
	    	                out.print(topology_json);
	    	                
	    	                
		                }
		                
		 
		            }
		            finally
		            {
		            	
		            }
		     /*       catch(SAXException saxex)
		            {
		            	
		            }*/

			}
			catch(Exception exp)
			{
				System.err.println("Exception Details" + exp.getMessage());
			}
 
		}
		else
		{
			out.write(topologyDetails);
		}
		
	
		out.close();
		
	}
	
	public int getRandomCoord(int upper_bound)
	{
		return rand_gen.nextInt(upper_bound);
	}
	
	public String getTopologyDetails(String topologyID)
	{
		
		// connecting to database
		Connection con = null;    
		Statement stmt = null;
		ResultSet rs = null;
	
		String p_name = topologyID;
		String p_language = "topoviz"; 
		
		net.sf.json.JSONArray jsarray = null;
		
		String topoResult = null;
	
		try 
		{
			Class.forName("com.mysql.jdbc.Driver");
			
			// TODO: the host, dbname, user credentials specifed should be read from a config file.
			
			con = DriverManager.getConnection ("jdbc:mysql://" + this.server +"/topoviz", this.uname, this.passwd);
			stmt = con.createStatement();
			String query = null;
			
			query = "SELECT * from wirings WHERE name='" + p_name + "' AND language='"+ p_language +"'";				
				
						
	       int count = 0;
	    
	       rs = stmt.executeQuery(query);
	    
	       while(rs.next())
	       {
	    	   count++;
	       }  
	       String result_set[] = null;
	      
	           
	       if(count > 0)
	       {
		      result_set = new String[count];
		       
		       rs.first();
		       
		       count = 0;
		       
		       String name_string = "name";
		       String lang_string = "language";
		       
		       do{	
		    	   
		    	   try
		    	   {
		    		   
		    		   topoResult = rs.getString ("working");
		    		   
		    		   jsarray  = new net.sf.json.JSONArray();
		    		   
		    		   JSONObject jo_working = new JSONObject().put("working", rs.getString ("working"));
		    		   
		    		   jsarray.add(jo_working.toString());
		    		   
		    	   }
		    	   catch(JSONException j)
		    	   {
		    		   
		    	   }
		    	   	    	  		    	   
		       }while(rs.next());
		       
		       
		       rs.close();
		       stmt.close(); 	
		         
	       }
		}
		catch (SQLException e) 
		{
			
		} 
		catch (ClassNotFoundException e) 
		{
			 
		}
		finally 
		{
			try 
			{
				if(rs != null) 
				{
					rs.close();
					rs = null;
				}
				if(stmt != null)
				{
					stmt.close();
					stmt = null;
				}
				if(con != null)
				{
					con.close();
					con = null;
				}
			}
			catch (SQLException e) 
			{
				
			}
		}
		
	    return topoResult;
		
	}
	
}
