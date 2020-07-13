package net.es.topologywizard.format.nmwg;


import org.apache.xerces.parsers.*;
import org.w3c.dom.Document;

import java.lang.*;
import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.util.*;
import java.util.zip.*;

import javax.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import net.sf.json.xml.XMLSerializer;

import org.apache.geronimo.mail.util.QuotedPrintable;
import org.apache.xerces.impl.dv.dtd.NMTOKENDatatypeValidator;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;
import org.w3c.dom.*;

import com.uwyn.jhighlight.renderer.XhtmlRendererFactory;


public class ExportNMWG {

	private String exp_name;
	private String exp_lang;
	private String exp_working;
	
	private String  prefixDemarker;
	private	String  baseOGFNS;
	private String baseOGFAssgmt;
	private String  nsSeperator;
	
	private Map linkReflectionMap;
	
	public ExportNMWG()
	{
		
	}
	
	public ExportNMWG(String name, String language, String working)
	{
		this.exp_name = name;
		this.exp_lang = language;
		this.exp_working = working;
		this.prefixDemarker = ":";
		this.baseOGFNS = "urn:ogf:network:domain";
		this.baseOGFAssgmt = "urn:ogf:network";
		this.nsSeperator = "=";
		this.linkReflectionMap = new HashMap();
		
	}
	
	public String buildNMWGXML()
	{
		String parsedXMLString = null;
		
		try
		{
		
			FileWriter fileWriter = new FileWriter("rawExportedMsg.log");	
		
			FileWriter xmlfileWriter;
			
			FileInputStream exportreadyxml_file; 
			 
			FileWriter exportReadyXML;
			
			fileWriter.write(this.exp_working);
		
			fileWriter.close();

			try
			{
			
			JSONObject json_obj = new JSONObject(this.exp_working);
			JSONArray nodeArray = json_obj.getJSONArray("modules");
			JSONObject propertiesArray = json_obj.getJSONObject("properties");
			JSONArray connectorArray = json_obj.getJSONArray("wires");
			
			
		
		        try {
		            
		            //Creating an empty XML Document

		            DocumentBuilderFactory dbfac = DocumentBuilderFactory.newInstance();
		            dbfac.setNamespaceAware(true);
		            DocumentBuilder docBuilder = dbfac.newDocumentBuilder();
		            Document doc = docBuilder.newDocument();

		            //Creating the XML tree
		            
		            Element root = doc.createElementNS("http://ogf.org/schema/network/topology/ctrlPlane/20080828/","CtrlPlane:topology");
		            
		            doc.appendChild(root);
		       
		            root.setAttribute("id",propertiesArray.getString("name"));
		            
		            xmlfileWriter = new FileWriter("i"+propertiesArray.getString("name")+ ".xml");
		             
		            exportReadyXML = new FileWriter(propertiesArray.getString("name")+ ".nmwg");
		            
		           // exportreadyxml_file = new FileInputStream(propertiesArray.getString("name")+ ".nmwg");
		            
		            Element documentation_element= doc.createElementNS("http://www.w3.org/2001/XMLSchema","xsd:documentation");
		            
		            documentation_element.setAttribute("lang", "en");//these properties can be set according to the culture info of the environment
		       
		            //create a comment to reflect all the topology description info passed
		            Text descr_comment = doc.createTextNode("Topology Description: " + propertiesArray.getString("description"));
		            Text mlt_comment = doc.createTextNode("Topology described below part of Multi Layer Topology description?: " + propertiesArray.getString("mlt"));
		            Text topo_category_comment = doc.createTextNode("Category of Topology: " + propertiesArray.getString("category"));
		            Text topo_format_comment = doc.createTextNode("Topology Format: " + propertiesArray.getString("topoformat"));
		            
		            documentation_element.appendChild(descr_comment);
		            documentation_element.appendChild(mlt_comment);
		            documentation_element.appendChild(topo_category_comment);
		            documentation_element.appendChild(topo_format_comment);

		           
		            root.appendChild(documentation_element);
		         
		            
		          
		           Element inter_domain_control_id = doc.createElement(root.getPrefix() + prefixDemarker + "idcId");  
		        
		           root.appendChild(inter_domain_control_id);
		           
		           inter_domain_control_id.setTextContent(propertiesArray.getString("name"));
		        
		           //inter_domain_control_id.setNodeValue(propertiesArray.getString("name"));
		           
					for(int node_itr = 0;node_itr < nodeArray.length();node_itr++)
					{
						
						JSONObject 	node_json	= nodeArray.getJSONObject(node_itr);
										

							JSONObject  node_value	= 	node_json.getJSONObject("value");

							String domain_id_str = node_value.getString("domainid");
							
							String node_id	= node_value.getString("nodeid");
							
							String module_id = node_json.getString("id");  
							
							String node_addr = node_value.getString("nodeaddress");
							
							
							
							JSONArray ports = node_value.getJSONArray("portInfo");
							
							  // get all the domain elements
					        NodeList domain_elements = doc.getElementsByTagName(root.getPrefix() + prefixDemarker + "domain");
					        
					        String no_of_domains=  Integer.toString(domain_elements.getLength());
					        
					       
					        
					        Element domain_el = null;
					        
					        Element node_el = doc.createElement(root.getPrefix() + prefixDemarker + "node");
					        
					        Element node_addr_el = doc.createElement(root.getPrefix() + prefixDemarker + "address");
					        
					        node_addr_el.setTextContent(node_addr);
					        
					         
					        
					        if (domain_elements.getLength() == 0) 
					        {
								//create a new domain and then add this node
								
					        	
					        	
					        	domain_el = doc.createElement(root.getPrefix() + prefixDemarker + "domain");
								
								root.appendChild(domain_el);
								
								domain_el.setAttribute("id", domain_id_str);
								
								node_el.setAttribute("id", baseOGFNS + nsSeperator + domain_id_str + prefixDemarker + "node" + nsSeperator + node_id);
								
								domain_el.appendChild(node_el);
								
								node_el.appendChild(node_addr_el); 
								
								Element port_el;
								
								Element link_el;
								
								for(int p=0;p < ports.length(); p++)
								{
									
									JSONObject 	port_json	= ports.getJSONObject(p);
									
									port_el = doc.createElement(root.getPrefix() + prefixDemarker + "port");
									
									String port_id_str =  port_json.getString("portID");
									
									String port_name =   port_json.getString("portName");
									
									port_el.setAttribute("id", node_el.getAttribute("id") + prefixDemarker + "port" + nsSeperator +  port_id_str);						 
									
									Element cap,maxRes,minRes,gran;
									
									cap = doc.createElement(root.getPrefix() + prefixDemarker + "capacity");
									cap.setTextContent(port_json.getString("Capacity"));
									port_el.appendChild(cap);
									
									maxRes = doc.createElement(root.getPrefix() + prefixDemarker + "maximumReservableCapacity");
									maxRes.setTextContent(port_json.getString("maxResCapacity"));
									port_el.appendChild(maxRes);
	
									minRes = doc.createElement(root.getPrefix() + prefixDemarker + "minimumReservableCapacity");
									minRes.setTextContent(port_json.getString("minResCapacity"));
									port_el.appendChild(minRes);

									gran = doc.createElement(root.getPrefix() + prefixDemarker +  "granularity");
									gran.setTextContent(port_json.getString("granularity"));
									port_el.appendChild(gran);
									
									node_el.appendChild(port_el);
									
									//now add the links
									
									boolean link_for_port_found = false;
									for(int c = 0; c < connectorArray.length(); c++)
									{
									
										JSONObject link_json = connectorArray.getJSONObject(c);
										
										JSONObject link_props_obj  = link_json.getJSONObject("linkProps");
										
										JSONObject link_src_obj = link_json.getJSONObject("src");
										
										JSONObject link_dest_obj = link_json.getJSONObject("tgt");
										
										link_el = doc.createElement(root.getPrefix() + prefixDemarker + "link");
										
										String src_node = link_src_obj.getString("moduleId");
										
										String src_port = link_src_obj.getString("terminal");
										
										String dest_node = link_dest_obj.getString("moduleId");
										
										String dest_port = link_dest_obj.getString("terminal");
										
										String port_lu_id, domain_lu_id, node_lu_id;
										
										port_lu_id =  domain_lu_id =  node_lu_id = "";
										
										
										
										if(src_node.equals(module_id))
										{
											if(port_name.equals(src_port))
											{
												
												
												link_for_port_found = true;
												//it is the same node and port we are dealing with so capture all the details 
												
												String capability = link_props_obj.getString("capability");
												
												String encType = link_props_obj.getString("encodingType");
												
												String intMTU = link_props_obj.getString("interfaceMTU");
												
												String linkid = link_props_obj.getString("linkid");
												
												String remotelink_id = link_props_obj.getString("remoteLinkId");
												
												String switchcapType = link_props_obj.getString("switchingcapType");
												
												String tem = link_props_obj.getString("trafficEngineeringMetric");
												
												String vlanRange = link_props_obj.getString("vlanRangeAvailability");
												
												link_el.setAttribute("id", port_el.getAttribute("id") + prefixDemarker + "link" + nsSeperator + linkid);
												
												port_el.appendChild(link_el);
												
												Element remoteLink_el = doc.createElement(root.getPrefix() + prefixDemarker + "remoteLinkId");
												
												boolean remote_details_found = false;
												//lookup the remote node details from the dest 
												for(int nod_lu_itr = 0; nod_lu_itr < nodeArray.length(); nod_lu_itr++)
												{
													
													JSONObject lookup_node  = nodeArray.getJSONObject(nod_lu_itr);
													
													if(lookup_node.getString("id").equals(dest_node))
													{
														JSONObject  node_lu_value	= 	lookup_node.getJSONObject("value");

														domain_lu_id = node_lu_value.getString("domainid");
														
														node_lu_id	= node_lu_value.getString("nodeid");
														
														JSONArray portinfo_lu  = node_lu_value.getJSONArray("portInfo");

														for(int port_lu_itr = 0; port_lu_itr < portinfo_lu.length();port_lu_itr++)
														{
															JSONObject portLuObj = portinfo_lu.getJSONObject(port_lu_itr);
															
															 if((portLuObj.getString("portName")).equals(dest_port))
															 {
																port_lu_id = portLuObj.getString("portID");
																
																remoteLink_el.setTextContent(this.baseOGFAssgmt + prefixDemarker + domain_lu_id + prefixDemarker + node_lu_id + prefixDemarker + port_lu_id + prefixDemarker + remotelink_id);
																
																remote_details_found = true;
																
																break;
															 }
															
														}	
														
													}
													
													if(remote_details_found)
													{
														break;
													}
													
												}
												
												
												link_el.appendChild(remoteLink_el);
												
												Element capab_el,encodingTyp_el,interfaceMTU_el,switchingcapType_el,tem_el,vlanRange_el;
												
												
												tem_el = doc.createElement(root.getPrefix() + prefixDemarker + "trafficEngineeringMetric");
												tem_el.setTextContent(link_props_obj.getString("trafficEngineeringMetric"));
												link_el.appendChild(tem_el);
																								
												Element SwitchingCapabilityDesc_el = doc.createElement(root.getPrefix() + prefixDemarker + "SwitchingCapabilityDescriptors");
												
												link_el.appendChild(SwitchingCapabilityDesc_el);
												
												switchingcapType_el = doc.createElement(root.getPrefix() + prefixDemarker + "switchingcapType");
												
												if(!link_props_obj.getString("switchingcapType").equals(""))
												{
													switchingcapType_el.setTextContent(link_props_obj.getString("switchingcapType"));
												}
												
												SwitchingCapabilityDesc_el.appendChild(switchingcapType_el);
												
												encodingTyp_el = doc.createElement(root.getPrefix() + prefixDemarker + "encodingType");
												
												encodingTyp_el.setTextContent(link_props_obj.getString("encodingType"));
												
												SwitchingCapabilityDesc_el.appendChild(encodingTyp_el);
												
												Element switchingCapab_SpecificInfo_el = doc.createElement(root.getPrefix() + prefixDemarker + "switchingCapabilitySpecificInfo");
												
												SwitchingCapabilityDesc_el.appendChild(switchingCapab_SpecificInfo_el);
												
												capab_el = doc.createElement(root.getPrefix() + prefixDemarker + "capability");
												
												capab_el.setTextContent(link_props_obj.getString("capability"));
												
												switchingCapab_SpecificInfo_el.appendChild(capab_el);
												
												interfaceMTU_el = doc.createElement(root.getPrefix() + prefixDemarker + "interfaceMTU");
												
												interfaceMTU_el.setTextContent(link_props_obj.getString("interfaceMTU"));
												
												switchingCapab_SpecificInfo_el.appendChild(interfaceMTU_el);
												
												vlanRange_el = doc.createElement(root.getPrefix() + prefixDemarker + "vlanRangeAvailability");
												
												vlanRange_el.setTextContent(link_props_obj.getString("vlanRangeAvailability"));
												
												switchingCapab_SpecificInfo_el.appendChild(vlanRange_el);
												
												if(link_for_port_found)
												{
													break;
												}
												//now add all the other link properties for this port
										
												
												
											}
											
											
										}
										
										
									}

									
									
									
								}
								
								
					        	
					        }
							
					        else
							{
								//atleast one domain exists. But make sure that this node belongs which one of the domain(s)
								
					        	
					        	
					            int domainCount = domain_elements.getLength();
					            boolean domain_found = false;
					            for (int i = 0; i < domainCount; i++) 
					            {
					            	domain_el  = (Element)domain_elements.item(i);
					                String domain_id = domain_el.getAttribute("id");
					               
					                if(domain_id.equals(domain_id_str))
					                {
					                	//this means the domain already exists and the node needs to appended as a child to this domain 
					                	
					                	domain_found = true;
					                	break;
					                }
					                
					            }
					            
					            if(domain_found)
					            {
					            	
					            	
									node_el.setAttribute("id", baseOGFNS + nsSeperator + domain_id_str + prefixDemarker + "node" + nsSeperator + node_id);
									
									domain_el.appendChild(node_el);
									
									node_el.appendChild(node_addr_el); 
									
									Element port_el;
									
									Element link_el;
									
									for(int p=0;p < ports.length(); p++)
									{
										
										JSONObject 	port_json	= ports.getJSONObject(p);
										
										port_el = doc.createElement(root.getPrefix() + prefixDemarker + "port");
										
										String port_id_str =  port_json.getString("portID");
										
										String port_name =   port_json.getString("portName");
										
										port_el.setAttribute("id", node_el.getAttribute("id") + prefixDemarker + "port" + nsSeperator +  port_id_str);						 
										
										Element cap,maxRes,minRes,gran;
										
										cap = doc.createElement(root.getPrefix() + prefixDemarker + "capacity");
										cap.setTextContent(port_json.getString("Capacity"));
										port_el.appendChild(cap);
										
										maxRes = doc.createElement(root.getPrefix() + prefixDemarker + "maximumReservableCapacity");
										maxRes.setTextContent(port_json.getString("maxResCapacity"));
										port_el.appendChild(maxRes);
		
										minRes = doc.createElement(root.getPrefix() + prefixDemarker + "minimumReservableCapacity");
										minRes.setTextContent(port_json.getString("minResCapacity"));
										port_el.appendChild(minRes);

										gran = doc.createElement(root.getPrefix() + prefixDemarker +  "granularity");
										gran.setTextContent(port_json.getString("granularity"));
										port_el.appendChild(gran);
										
										node_el.appendChild(port_el);
										
										//now add the links
										
										boolean link_for_port_found = false;
										for(int c = 0; c < connectorArray.length(); c++)
										{
										
											JSONObject link_json = connectorArray.getJSONObject(c);
											
											JSONObject link_props_obj  = link_json.getJSONObject("linkProps");
											
											JSONObject link_src_obj = link_json.getJSONObject("src");
											
											JSONObject link_dest_obj = link_json.getJSONObject("tgt");
											
											link_el = doc.createElement(root.getPrefix() + prefixDemarker + "link");
											
											String src_node = link_src_obj.getString("moduleId");
											
											String src_port = link_src_obj.getString("terminal");
											
											String dest_node = link_dest_obj.getString("moduleId");
											
											String dest_port = link_dest_obj.getString("terminal");
											
											String port_lu_id, domain_lu_id, node_lu_id;
											
											port_lu_id =  domain_lu_id =  node_lu_id = "";
											
											if(src_node.equals(module_id))
											{
												if(port_name.equals(src_port))
												{
													link_for_port_found = true;
													//it is the same node and port we are dealing with so capture all the details 
													
													String capability = link_props_obj.getString("capability");
													
													String encType = link_props_obj.getString("encodingType");
													
													String intMTU = link_props_obj.getString("interfaceMTU");
													
													String linkid = link_props_obj.getString("linkid");
													
													String remotelink_id = link_props_obj.getString("remoteLinkId");
													
													String switchcapType = link_props_obj.getString("switchingcapType");
													
													String tem = link_props_obj.getString("trafficEngineeringMetric");
													
													String vlanRange = link_props_obj.getString("vlanRangeAvailability");
													
													link_el.setAttribute("id", port_el.getAttribute("id") + prefixDemarker + "link" + nsSeperator + linkid);
													
													port_el.appendChild(link_el);
													
													Element remoteLink_el = doc.createElement(root.getPrefix() + prefixDemarker + "remoteLinkId");
													
													boolean remote_details_found = false;
													//lookup the remote node details from the dest 
													for(int nod_lu_itr = 0; nod_lu_itr < nodeArray.length(); nod_lu_itr++)
													{
														
														JSONObject lookup_node  = nodeArray.getJSONObject(nod_lu_itr);
														
														if(lookup_node.getString("id").equals(dest_node))
														{
															JSONObject  node_lu_value	= 	lookup_node.getJSONObject("value");

															domain_lu_id = node_lu_value.getString("domainid");
															
															node_lu_id	= node_lu_value.getString("nodeid");
															
															JSONArray portinfo_lu  = node_lu_value.getJSONArray("portInfo");

															for(int port_lu_itr = 0; port_lu_itr < portinfo_lu.length();port_lu_itr++)
															{
																JSONObject portLuObj = portinfo_lu.getJSONObject(port_lu_itr);
																
																 if((portLuObj.getString("portName")).equals(dest_port))
																 {
																	port_lu_id = portLuObj.getString("portID");
																	
																	remoteLink_el.setTextContent(this.baseOGFAssgmt + prefixDemarker + domain_lu_id + prefixDemarker + node_lu_id + prefixDemarker + port_lu_id + prefixDemarker + remotelink_id);
																	
																	remote_details_found = true;
																	
																	break;
																 }
																
															}	
															
														}
														
														if(remote_details_found)
														{
															break;
														}
														
													}
													
													
													link_el.appendChild(remoteLink_el);
													
													Element capab_el,encodingTyp_el,interfaceMTU_el,switchingcapType_el,tem_el,vlanRange_el;
													
													
													tem_el = doc.createElement(root.getPrefix() + prefixDemarker + "trafficEngineeringMetric");
													tem_el.setTextContent(link_props_obj.getString("trafficEngineeringMetric"));
													link_el.appendChild(tem_el);
																									
													Element SwitchingCapabilityDesc_el = doc.createElement(root.getPrefix() + prefixDemarker + "SwitchingCapabilityDescriptors");
													
													link_el.appendChild(SwitchingCapabilityDesc_el);
													
													switchingcapType_el = doc.createElement(root.getPrefix() + prefixDemarker + "switchingcapType");
													
													if(!link_props_obj.getString("switchingcapType").equals(""))
													{
														switchingcapType_el.setTextContent(link_props_obj.getString("switchingcapType"));
													}
													
													SwitchingCapabilityDesc_el.appendChild(switchingcapType_el);
													
													encodingTyp_el = doc.createElement(root.getPrefix() + prefixDemarker + "encodingType");
													
													encodingTyp_el.setTextContent(link_props_obj.getString("encodingType"));
													
													SwitchingCapabilityDesc_el.appendChild(encodingTyp_el);
													
													Element switchingCapab_SpecificInfo_el = doc.createElement(root.getPrefix() + prefixDemarker + "switchingCapabilitySpecificInfo");
													
													SwitchingCapabilityDesc_el.appendChild(switchingCapab_SpecificInfo_el);
													
													capab_el = doc.createElement(root.getPrefix() + prefixDemarker + "capability");
													
													capab_el.setTextContent(link_props_obj.getString("capability"));
													
													switchingCapab_SpecificInfo_el.appendChild(capab_el);
													
													interfaceMTU_el = doc.createElement(root.getPrefix() + prefixDemarker + "interfaceMTU");
													
													interfaceMTU_el.setTextContent(link_props_obj.getString("interfaceMTU"));
													
													switchingCapab_SpecificInfo_el.appendChild(interfaceMTU_el);
													
													vlanRange_el = doc.createElement(root.getPrefix() + prefixDemarker + "vlanRangeAvailability");
													
													vlanRange_el.setTextContent(link_props_obj.getString("vlanRangeAvailability"));
													
													switchingCapab_SpecificInfo_el.appendChild(vlanRange_el);
													
													if(link_for_port_found)
													{
														break;
													}
													//now add all the other link properties for this port
											
													
													
												}
												
												
											}
											
											
										}
	
									}
					            	
					            }
					            else
					            {
					            	
									//create a new domain and then add this node (same as if (domain_elements == null)
									
									//create a new domain and then add this node
									
						        	domain_el = doc.createElement(root.getPrefix() + prefixDemarker + "domain");
									
									root.appendChild(domain_el);
									
									domain_el.setAttribute("id", domain_id_str);
									
									node_el.setAttribute("id", baseOGFNS + nsSeperator + domain_id_str + prefixDemarker + "node" + nsSeperator + node_id);
									
									domain_el.appendChild(node_el);
									
									node_el.appendChild(node_addr_el); 
									
									Element port_el;
									
									Element link_el;
									
									for(int p=0;p < ports.length(); p++)
									{
										
										JSONObject 	port_json	= ports.getJSONObject(p);
										
										port_el = doc.createElement(root.getPrefix() + prefixDemarker + "port");
										
										String port_id_str =  port_json.getString("portID");
										
										String port_name =   port_json.getString("portName");
										
										port_el.setAttribute("id", node_el.getAttribute("id") + prefixDemarker + "port" + nsSeperator +  port_id_str);						 
										
										Element cap,maxRes,minRes,gran;
										
										cap = doc.createElement(root.getPrefix() + prefixDemarker + "capacity");
										cap.setTextContent(port_json.getString("Capacity"));
										port_el.appendChild(cap);
										
										maxRes = doc.createElement(root.getPrefix() + prefixDemarker + "maximumReservableCapacity");
										maxRes.setTextContent(port_json.getString("maxResCapacity"));
										port_el.appendChild(maxRes);
		
										minRes = doc.createElement(root.getPrefix() + prefixDemarker + "minimumReservableCapacity");
										minRes.setTextContent(port_json.getString("minResCapacity"));
										port_el.appendChild(minRes);

										gran = doc.createElement(root.getPrefix() + prefixDemarker +  "granularity");
										gran.setTextContent(port_json.getString("granularity"));
										port_el.appendChild(gran);
										
										node_el.appendChild(port_el);
										
										//now add the links
										
										boolean link_for_port_found = false;
										for(int c = 0; c < connectorArray.length(); c++)
										{
										
											JSONObject link_json = connectorArray.getJSONObject(c);
											
											JSONObject link_props_obj  = link_json.getJSONObject("linkProps");
											
											JSONObject link_src_obj = link_json.getJSONObject("src");
											
											JSONObject link_dest_obj = link_json.getJSONObject("tgt");
											
											link_el = doc.createElement(root.getPrefix() + prefixDemarker + "link");
											
											String src_node = link_src_obj.getString("moduleId");
											
											String src_port = link_src_obj.getString("terminal");
											
											String dest_node = link_dest_obj.getString("moduleId");
											
											String dest_port = link_dest_obj.getString("terminal");
											
											String port_lu_id, domain_lu_id, node_lu_id;
											
											port_lu_id =  domain_lu_id =  node_lu_id = "";
											
											if(src_node.equals(module_id))
											{
												if(port_name.equals(src_port))
												{
													link_for_port_found = true;
													//it is the same node and port we are dealing with so capture all the details 
													
													String capability = link_props_obj.getString("capability");
													
													String encType = link_props_obj.getString("encodingType");
													
													String intMTU = link_props_obj.getString("interfaceMTU");
													
													String linkid = link_props_obj.getString("linkid");
													
													String remotelink_id = link_props_obj.getString("remoteLinkId");
													
													String switchcapType = link_props_obj.getString("switchingcapType");
													
													String tem = link_props_obj.getString("trafficEngineeringMetric");
													
													String vlanRange = link_props_obj.getString("vlanRangeAvailability");
													
													link_el.setAttribute("id", port_el.getAttribute("id") + prefixDemarker + "link" + nsSeperator + linkid);
													
													port_el.appendChild(link_el);
													
													Element remoteLink_el = doc.createElement(root.getPrefix() + prefixDemarker + "remoteLinkId");
													
													boolean remote_details_found = false;
													//lookup the remote node details from the dest 
													for(int nod_lu_itr = 0; nod_lu_itr < nodeArray.length(); nod_lu_itr++)
													{
														
														JSONObject lookup_node  = nodeArray.getJSONObject(nod_lu_itr);
														
														if(lookup_node.getString("id").equals(dest_node))
														{
															JSONObject  node_lu_value	= 	lookup_node.getJSONObject("value");

															domain_lu_id = node_lu_value.getString("domainid");
															
															node_lu_id	= node_lu_value.getString("nodeid");
															
															JSONArray portinfo_lu  = node_lu_value.getJSONArray("portInfo");

															for(int port_lu_itr = 0; port_lu_itr < portinfo_lu.length();port_lu_itr++)
															{
																JSONObject portLuObj = portinfo_lu.getJSONObject(port_lu_itr);
																
																 if((portLuObj.getString("portName")).equals(dest_port))
																 {
																	port_lu_id = portLuObj.getString("portID");
																	
																	remoteLink_el.setTextContent(this.baseOGFAssgmt + prefixDemarker + domain_lu_id + prefixDemarker + node_lu_id + prefixDemarker + port_lu_id + prefixDemarker + remotelink_id);
																	
																	remote_details_found = true;
																	
																	break;
																 }
																
															}	
															
														}
														
														if(remote_details_found)
														{
															break;
														}
														
													}
													
													
													link_el.appendChild(remoteLink_el);
													
													Element capab_el,encodingTyp_el,interfaceMTU_el,switchingcapType_el,tem_el,vlanRange_el;
													
													
													tem_el = doc.createElement(root.getPrefix() + prefixDemarker + "trafficEngineeringMetric");
													tem_el.setTextContent(link_props_obj.getString("trafficEngineeringMetric"));
													link_el.appendChild(tem_el);
																									
													Element SwitchingCapabilityDesc_el = doc.createElement(root.getPrefix() + prefixDemarker + "SwitchingCapabilityDescriptors");
													
													link_el.appendChild(SwitchingCapabilityDesc_el);
													
													switchingcapType_el = doc.createElement(root.getPrefix() + prefixDemarker + "switchingcapType");
													
													
													if(!link_props_obj.getString("switchingcapType").equals(""))
													{
														switchingcapType_el.setTextContent(link_props_obj.getString("switchingcapType"));
													}
													
													SwitchingCapabilityDesc_el.appendChild(switchingcapType_el);
													
													encodingTyp_el = doc.createElement(root.getPrefix() + prefixDemarker + "encodingType");
													
													encodingTyp_el.setTextContent(link_props_obj.getString("encodingType"));
													
													SwitchingCapabilityDesc_el.appendChild(encodingTyp_el);
													
													Element switchingCapab_SpecificInfo_el = doc.createElement(root.getPrefix() + prefixDemarker + "switchingCapabilitySpecificInfo");
													
													SwitchingCapabilityDesc_el.appendChild(switchingCapab_SpecificInfo_el);
													
													capab_el = doc.createElement(root.getPrefix() + prefixDemarker + "capability");
													
													capab_el.setTextContent(link_props_obj.getString("capability"));
													
													switchingCapab_SpecificInfo_el.appendChild(capab_el);
													
													interfaceMTU_el = doc.createElement(root.getPrefix() + prefixDemarker + "interfaceMTU");
													
													interfaceMTU_el.setTextContent(link_props_obj.getString("interfaceMTU"));
													
													switchingCapab_SpecificInfo_el.appendChild(interfaceMTU_el);
													
													vlanRange_el = doc.createElement(root.getPrefix() + prefixDemarker + "vlanRangeAvailability");
													
													vlanRange_el.setTextContent(link_props_obj.getString("vlanRangeAvailability"));
													
													switchingCapab_SpecificInfo_el.appendChild(vlanRange_el);
													
													if(link_for_port_found)
													{
														break;
													}
													//now add all the other link properties for this port
											
													
													
												}
												
												
											}
											
											
										}

									
										
									}
									
																																				
					            }
								
							}							
							
						
					}
		           
		 
		       
		            //Output the XML

		            //set up a transformer
		            TransformerFactory transfac = TransformerFactory.newInstance();
		            Transformer trans = transfac.newTransformer();
		            trans.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
		            trans.setOutputProperty(OutputKeys.INDENT, "yes");

		            //create string from xml tree
		            StringWriter sw = new StringWriter();
		            StreamResult result = new StreamResult(sw);
		            DOMSource source = new DOMSource(doc);
		            trans.transform(source, result);
		            String xmlString = sw.toString();

		           
		            
		            
		            xmlfileWriter.write(xmlString);
		            xmlfileWriter.close();

		            File xmlFile = new File("i"+propertiesArray.getString("name")+ ".xml");
		            
		            Document parse_doc = null;
		            
		            DOMParser parser = new DOMParser();
		            
		            parser.parse(xmlFile.toURL().toString());
		            
		            parse_doc = parser.getDocument( );
		            
		          //  String[] log_reflective_links = new String[200];
		            
		          //  int log_refl_links_itr = 0;
		            
		            Element root_xml = parse_doc.getDocumentElement( );
		            
		            NodeList parsed_domains_elems = root_xml.getElementsByTagName("CtrlPlane:domain");
		          
		            if (parsed_domains_elems == null) {
		            	
		            	System.err.println("atleast one domain expected in a topology. please specify the domain details");
		                return "Incorrect Domain Details";
		            }
		            
		            else
		            {
		            	
		                int p_domainCount = parsed_domains_elems.getLength();
		                
		                for (int domain_iter = 0; domain_iter < p_domainCount; domain_iter++) 
		                {
		                    Element  p_domain_element = (Element)parsed_domains_elems.item(domain_iter);
		                   
		                    
		                    NodeList  p_node_elements  = p_domain_element.getElementsByTagName("CtrlPlane:node");
		                     
			                for (int p_node_iter = 0; p_node_iter < p_node_elements.getLength(); p_node_iter++) 
			                {
			                	
			                	 Element  p_node_ele = (Element)p_node_elements.item(p_node_iter);

			                	NodeList p_port_elements = p_node_ele.getElementsByTagName("CtrlPlane:port");
			                	 
			                	for(int p_port_iter = 0; p_port_iter < p_port_elements.getLength(); p_port_iter++)
			                	{
			                		Element p_port_ele	= (Element) p_port_elements.item(p_port_iter);
			                		
			                		NodeList  p_links_elements = p_port_ele.getElementsByTagName("CtrlPlane:link");
			                		
			                		if(p_links_elements == null)
			                		{
			                			break;
			                		}
			                		else
			                		{
			                			for(int p_link_itr = 0; p_link_itr < p_links_elements.getLength(); p_link_itr++)
			                			{
			                				//get all the link details and parse it and reverse format for link node attribute id and 
			                				//remotelinkid node value, clone the other link properties and store it in a map as to which [domain,node,port] to append it to after
			                				//parsing the entire xml once such that no cyclic redundancy occurs.
			                				
			                				       Element p_link_ele = (Element)p_links_elements.item(p_link_itr);
			                				
			                				       String p_link_id_str =  p_link_ele.getAttribute("id");
			                				       
			                				     /*  boolean reflection_already_present = false;
			                				       for(int lookup_reflection_itr = 0;lookup_reflection_itr < log_reflective_links.length ;lookup_reflection_itr++)
			                				       {
			                				    	   if(log_reflective_links[lookup_reflection_itr].equals(p_link_id_str))
			                				    	   {
			                				    		   //this means that there is no need to create reflections
			                				    		   reflection_already_present = true; 
			                				    		   break;
			                				    	   }
			                				       }
			                				       
			                				       if(reflection_already_present)
			                				       {
			                				    	   break;
			                				       }*/
			                				       
			                				       	if(linkReflectionMap.get(p_link_id_str)!= null)
			                				       	{
			                				       		break;
			                				       	}
			                				       
			                				       String[] breakup_link_id;
			                				       
			                				       /* delimiter */
			                				       String delimiter = ":";
			                				      
			                				       breakup_link_id = p_link_id_str.split(delimiter);
			                				      
			                				       
			                				       //prefix rl stands for reverse link
			                				      
			                				       String rl_remoteLinkId = this.baseOGFAssgmt;
			                				       
			                				       String rl_link_main_id = this.baseOGFNS;

			                				       String rl_domainid, rl_nodeid, rl_portid, rl_link_id;    
			                				       
			                				       rl_domainid = rl_nodeid =  rl_portid = rl_link_id = null;
			                				       
			                				       for(int breakup_lid_itr =3; breakup_lid_itr< breakup_link_id.length ; breakup_lid_itr++)
			                				       {
			                				    	   StringTokenizer str_tok_lid = new StringTokenizer(breakup_link_id[breakup_lid_itr], "=");
			                				    	   while(str_tok_lid.hasMoreTokens())
			                				    	   {
			                				    		   String key = str_tok_lid.nextToken();
			                				    		   String val = str_tok_lid.nextToken();
			                				    		 
			                				    		   rl_remoteLinkId += prefixDemarker + val;
			                				    		  
			                				    		  // Map<String, V>
			                				    	   }
			                				    	   
			                				       }
			                				       
			                				      
			                				       
			                				       NodeList remote_link_id_els =  p_link_ele.getElementsByTagName("CtrlPlane:remoteLinkId");
			                				                       				       
			                				       Element remote_link_id_ele = (Element)remote_link_id_els.item(0);
			                				       
			                				       String link_id_value_str = remote_link_id_ele.getTextContent();
			                				       
			                				       
			                				       
			                				       delimiter = ":";
			                				       
			                				       breakup_link_id = link_id_value_str.split(delimiter);
				                				      
			                				       for(int breakup_lid_itr = 3; breakup_lid_itr< breakup_link_id.length ; breakup_lid_itr++)
			                				       {
			                				    	  
			                				    	   
			                				    	   if(breakup_lid_itr == 3)
			                				    	   {
			                				    		   rl_domainid = breakup_link_id[breakup_lid_itr];
			                				    	   }
			                				    	   else if(breakup_lid_itr == 4)
			                				    	   {
			                				    		   rl_nodeid = breakup_link_id[breakup_lid_itr];
			                				    	   }
			                				    	   else if(breakup_lid_itr == 5)
			                				    	   {
			                				    		   rl_portid = breakup_link_id[breakup_lid_itr];
			                				    	   }
			                				    	   else if(breakup_lid_itr == 6)
			                				    	   {
			                				    		   rl_link_id = breakup_link_id[breakup_lid_itr];
			                				    	   }

			                				       }
			                				       
			                				       
			                				       rl_link_main_id += nsSeperator + rl_domainid + prefixDemarker + "node" + nsSeperator + rl_nodeid + prefixDemarker + "port" + nsSeperator + rl_portid + prefixDemarker +"link" + nsSeperator + rl_link_id;
			                				   
			                				       
			                				       
			                				       //now check the whole topology for the correct reflective domain+node+port and insert the rl_link and rl_remote_link and clone and copy the rest of the link 
			                				       //properties.
			                				       
			                				       boolean reflective_port_found = false;
			                				       
			                				       for(int reflect_domain_itr = 0; (reflect_domain_itr < parsed_domains_elems.getLength()) && (!reflective_port_found); reflect_domain_itr++)
			                				       {
			                				    	   
			                				    	   Element reflect_domain_ele = (Element)parsed_domains_elems.item(reflect_domain_itr);
			                				    	   
			                				    	   if((reflect_domain_ele.getAttribute("id")).equals(rl_domainid))
			                				    	   {
			                				    		   //we are in the correct domain
			                				    		   	
			                				    		   	NodeList  reflect_nodes	= reflect_domain_ele.getElementsByTagName("CtrlPlane:node");
			                				    		   
			                				    		   	for(int reflect_node_itr = 0;(reflect_node_itr < reflect_nodes.getLength()) && (!reflective_port_found) ;reflect_node_itr++)
			                				    		   	{
			                				    		   			Element  reflect_node_ele	= (Element) reflect_nodes.item(reflect_node_itr);
			                				    		   			
			                				    		   			String chk_reflect_node_id = this.baseOGFNS + nsSeperator + rl_domainid + prefixDemarker + "node" + nsSeperator + rl_nodeid;
			                				    		   			
			                				    		   			if((reflect_node_ele.getAttribute("id")).equals(chk_reflect_node_id))
			                				    		   			{
			                				    		   				
			                				    		   				NodeList reflect_ports = reflect_node_ele.getElementsByTagName("CtrlPlane:port");
			                				    		   				
			                				    		   				for(int reflect_port_itr = 0;(reflect_port_itr< reflect_ports.getLength()) && (!reflective_port_found);reflect_port_itr++)
			                				    		   				{
			                				    		   					
			                				    		   						Element  reflect_port_ele	= (Element) reflect_ports.item(reflect_port_itr);
			                				    		   					
			                				    		   						if((reflect_port_ele.getAttribute("id")).equals(chk_reflect_node_id + prefixDemarker + "port" + nsSeperator + rl_portid))
			                				    		   						{
			                				    		   						
			                				    		   						/*	Element reflect_link_el = parse_doc.createElement("CtrlPlane:link");
			                				    		   							
			                				    		   							reflect_port_ele.appendChild(reflect_link_el);
			                				    		   							
			                				    		   							reflect_link_el.setAttribute("id", rl_link_main_id);*/
			                				    		   							
			                				    		   							//create the clone
			                				    		   							
			                				    		   						//	Node cloned_link  = parse_doc.importNode(p_link_ele , true);
			                				    		   							
			                				    		   						Node cloned_link = p_link_ele.cloneNode(true);
			                				    		   						
			                				    		   						Element cloned_link_ele =  (Element)cloned_link;
			                				    		   						
			                				    		   						cloned_link_ele.setAttribute("id",rl_link_main_id);
			                				    		   						
		                				    		   							NodeList reset_remote_linkid = cloned_link_ele.getElementsByTagName("CtrlPlane:remoteLinkId");
		                				    		   							
		                				    		   							Element reset_remotelink_el  = (Element) reset_remote_linkid.item(0);
		                				    		   							
		                				    		   							reset_remotelink_el.setTextContent(rl_remoteLinkId);
			                				    		   						
			                				    		   						reflect_port_ele.appendChild(cloned_link_ele);
			                				    		   						
			                				    		   						                				    		   							
			                				    		   								 	
			                				    		   							reflective_port_found = true;
			                				    		   							
			                				    		   							linkReflectionMap.put(rl_link_main_id , rl_remoteLinkId);
			                				    		   							
			                				    		   							//log_reflective_links[log_refl_links_itr++] = rl_link_main_id;  
			                				    		   							
			                				    		   						}
			                				    		   						
			                				    		   				}
			                				    		   				
			                				    		   			}
			                				    		   	
			                				    		   	}
			                				    		   	
			                				    		   	
			                				    		   
			                				    		   
			                				    	   }
			                				    	   
			                				    	   
			                				       }
			                				            
			                				      
			                			}
			                			
			                		}
			                		
			                			
			                		
			                	}
			                	
			                	
			                }
		                    
		                    
		                    
		                }
		            }
		            
		            sw = new StringWriter();
		            result = new StreamResult(sw);
		            source = new DOMSource(parse_doc);
		            trans.transform(source, result);
		            parsedXMLString = sw.toString();
		            
		            
		            
		            exportReadyXML.write(parsedXMLString);
		            exportReadyXML.close();
		            
		         /*   String zipFilename = propertiesArray.getString("name") + ".zip";
		            ZipOutputStream zipOutStream = new ZipOutputStream(new FileOutputStream(zipFilename));
		            
		            byte[] temp_file_buffer = new byte[20000];

		            // Add ZIP entry to output stream.
		            zipOutStream.putNextEntry(new ZipEntry(propertiesArray.getString("name")+ ".nmwg"));

		            // Transfer bytes from the file to the ZIP file
		            int len;
		            while ((len = exportreadyxml_file.read(temp_file_buffer)) > 0) {
		            	zipOutStream.write(temp_file_buffer, 0, len);
		            }

		            // Complete the entry
		            zipOutStream.closeEntry();
		            exportreadyxml_file.close();*/

		            parsedXMLString = XhtmlRendererFactory.getRenderer(XhtmlRendererFactory.XML).highlight("Topology Description in NMWG Format for OSCARS", parsedXMLString,"UTF-8", false);
		    		
		      

		        } catch (Exception e) {
		            System.out.println(e.getMessage() + " and stack is :" +   e.getStackTrace() + e.getLocalizedMessage());
		        }

					

			}
			catch(JSONException ex)
			{
				System.err.println("raw read exception" + " msg : " + ex.getMessage());
			}
			
		
		}
		catch(IOException ioex)
		{
			System.err.println("raw export write exception");
		}
		
		return  parsedXMLString;
	}
	
}
